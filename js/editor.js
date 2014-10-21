var $ = require('jquery');
require('./external-libs/jquery.sortable');
var _ = require('lodash');
var render = require('./render');
var api = require('./edit_api');
var Promise = require('promise-polyfill');
var tweditor = require('./smoke_tweditor');

/**
 * Includes functions to be called by the router.
 * Each should take a callback that takes in data, and html.
 * Each should return a promise which is resolved after components are loaded
 * @module editor
 */

/**
 * Function to make a component a form. If a single component,
 * makes it's metadata, attributes and main data editable.
 * If an array (a list) makes the array sortable.
 * Adds a save buttton to the component.
 * @param {component} component - The component we're making editable
 * @returns {void}
 */
exports.makeEditable = function(component) {
  for (var meta in component.metadata) {
    exports.editableMetadata(component, meta);
  }
  for (var name in component.attributes) {
    if (_.isArray( component.attributes[name] )) {
      exports.makeListsEditable(name, component);
    } else {
      exports.makeEditable(component.attributes[name]);
    }
  }
  exports.editableData(component);
  $('#' + component.slug).append(exports.saveComponentButton(component));
};

/**
 * Makes uls which pre-exist on the page editable
 * @param {string} attribute - The name of the array we're making sortable
 * @param {array} components - The component array we're making sortable
 * @returns {void}
 */
exports.makeListsEditable = function(attribute, component) {
  var lists = $('[data-attribute="' + attribute + '"][data-slug="' + component.slug + '"]');
  lists.each(function() {
    exports.makeListEditable($(this), component);
  });
}

/**
 * Makes an array sortable, it's members deletable, and gives it a save button
 * @param {list} element - The element containing the list
 * @param {array} components - The component array we're making sortable
 * @returns {list} the list element
 */
exports.makeListEditable = function(list, component) {
  if (typeof list === 'string') { list = $(list) }
  var attribute = list.data('attribute');
  list.sortable().bind('sortupdate', function() {
    exports.listSortedAction(list, component);
  });
  list.find('li').each(function() {
    $(this).append(
      exports.removeFromListButton($(this).data('slug'), attribute, component)
    );
  });
  list.append(exports.addToListButton(attribute, component));
  list.append(exports.saveListButton(attribute, component));
  return list;
};

/**
 * Change the component's attribute to match the new order of a list.
 * Runs after a list is sorted by an editor.
 * @param {element} list - The jQuery list that was sorted
 * @param {component} component - The component the attribute belongs to
 * @returns {void}
 */
exports.listSortedAction = function(list, component) {
  var attribute = list.data('attribute');
  var listOrder = [];
  list.children('li').each(function() {
    listOrder.push($(this).data('slug'));
  });
  var attributeOrder = [];
  for (var i = 0; i < listOrder.length; i++) {
    for (var j = 0; j < component.attributes[attribute].length; j++) {
      if (component.attributes[attribute][j].slug === listOrder[i]) {
        attributeOrder.push(component.attributes[attribute][j]);
        break;
      }
    }
  }
  component.attributes[attribute] = attributeOrder;

  exports.remakeLists(component, list.data('attribute'));
};

/**
 * Re-render all lists associated w/ an attribute for a component
 * @param {component} component - The component the attribute belongs to
 * @param {string} attribute - The attribute whose lists you want to remake
 * @returns {promise} resolved after all lists are made and editor capabilities reapplied
 */
exports.remakeLists = function(component, attribute) {
  var lists = $('[data-attribute="' + attribute + '"]' +
      '[data-slug="' + component.slug + '"]');

  var listsRemade = [];

  lists.each(function() {
    var list = $(this);
    var params = {
      slug: component.slug,
      items: component.attributes[attribute],
      template: $(this).data('template'),
      attribute: attribute
    };
    listsRemade.push(new Promise(function(res) {
      render.render('sortable_list', params, function(html) {
        list.before($(html)).remove();
        res();
      });
    }));
  });

  return new Promise(function(res, rej) {
    Promise.all(listsRemade).then(function() {
      exports.makeListsEditable(attribute, component);
      res();
    }, rej);
  });
};

/**
 * Creates a button that adds a new component to a list, both in the browser
 * and in the parent component.
 * @param {string} name - The name of the list we're adding to
 * @param {component} component - The list we're sorting
 * @returns {void}
 */
exports.addToListButton = function(name, component) {
  return $('<button class="add-to-list">+</button>')
    .click(function() {
      $(this).before(exports.addToListForm(name, component, $(this)));
      $(this).prop('disabled', true);
    });
};

/**
 * Called when an editor wants to add to a list.
 * Should create a form where editors can select a component to add to the list
 * @param {string} name - The name of the list we're adding to
 * @param {component} component - The list we're sorting
 * @param {element} button - The button that created htis list
 * @returns {element} - the form
 */

exports.addToListForm = function(name, component, button) {
  //FIXME we really want autocomplete, relying editors to know slugs is dumb
  var form = $('<form><label>Add another ' + name +
    '</label><input name="slug" type="text" placeholder="slug"/></form>')
    .submit(function() {
      exports.addItemToList(form, name, component);
      button.prop('disabled', false);
      return false;
    });
  var close = $('<span class="cancel">x</span>').click(function() {
      button.prop('disabled', false);
      form.remove();
      return false;
    });
  form.append(close);
  return form;
};

/**
 * Called when an editor submits the add to a list form.
 * Should create a form where editors can select a component to add to the list
 * @param {element} form - The element the form is in
 * @param {string} name - The name of the list we're adding to
 * @param {component} component - The list we're sorting
 * @returns {promise} resolved on lists being remade
 */
exports.addItemToList = function(form, name, component) {
  var item = new api.Component(form.find('[name="slug"]').val());
  form.prop('disabled', true).addClass('disabled');
  return new Promise(function(res, rej) {
      item.get().then(function() {

      component.attributes[name].push(item);
      exports.remakeLists(component, name).then(res);

    }, function(err) {
      form.prop('disabled', false).addClass('disabled');
      exports.failureNotice(err);
      rej();
    });
  });
};

/**
 * Creates a button that removes a list item from a list, and updates its
 * parent component to no longer have that item.
 * @param {string} item - The slug of the item the button is for
 * @param {string} list - The name of the list on the parent component
 * @param {component} component - The parent of the attribute we're sorting
 * @returns {void}
 */
exports.removeFromListButton = function(item, list, component) {
  return $('<button class="remove-from-list">x</button>')
    .click(function() {
      _.remove(component.attributes[list], function(comp) {
        return item === comp.slug;
      });
      $('[data-attribute="' + list + '"]' +
        '[data-slug="' + component.slug + '"]' +
        ' li[data-slug="' + item + '"]').remove();
    });
};

/**
 * Creates a button that will tell a component to update mirrors with a new
 * list for an attribute
 * @param {string} name - The name of the attribute
 * @param {component} component - The component containing the list we're sorting
 * @returns {void}
 */
exports.saveListButton = function(name, component) {
  return $('<button>Save List</button>')
    .click(function() {
      component.setAttribute(name, component.slug).then(
        exports.successNotice,
        exports.failureNotice
      );
    });
};
/**
 * Make a component's data inline editable.
 * FIXME this is a stub for images
 * @param {component} component - The component who's data we're making editable
 * @returns {void}
 */
exports.editableData = function(component) {
  if (component.content_type.match(/markdown/i)) {
    component.data.get().then(function() {
      var textArea = $('<textarea class="component_body" data-slug="'
        + component.slug + '">' + component.data.data + '</textarea>');

      var selector = '.component_body[data-slug="' + component.slug + '"]';
      $(selector).replaceWith(textArea);
      var editor = tweditor.tweditor(selector);
      editor.on('blur', function() {
        component.data.data = editor.getValue();
      });
    });
  }
  if (component.content_type.match(/image/i)) {
    console.log('implement fancy image stuff');
  };
};

/**
 * Makes a metadata html element editable, and makes
 * changes on the component object when the content changes.
 * @param {component} component - The component who's metadata we're making editable
 * @param {string} meta - The name of the metadata we're making editable
 * @returns {void}
 */
exports.editableMetadata = function(component, meta) {
  $('[data-slug="' + component.slug + '"][data-metadata="' + meta + '"]')
    .attr('contentEditable', true)
    .on('blur', function() {
      component.metadata[meta] = $(this).text();
    });
};

/**
 * Creates an HTML panel from which editors can change component
 * metadata related to social sharing
 * @param {component} component - The component who's social data we're editing
 * @param {string} meta - The name of the metadata we're making editable
 * @returns {string} html - the raw html of the social sharing element
 */
exports.socialSharingElement = function(component) {
  return "<div><h4>this could one day be an edit popup or something" + component.slug + "</h4></div>";
};

/**
 * Creates the button that updates a component on mirrors
 * @param {component} component - The component that will be updated
 * @returns {element} button - the jQuery element that will update a component on click
 */
exports.saveComponentButton = function(component) {
  return $('<button>Save</button>')
    .click(function() {
      component.update().then(
        function() {
          component.data.update().then(
            exports.successNotice,
            exports.failureNotice
          );
        },
        exports.failureNotice
      );
    }
  );
};

/**
 * Runs when a component is successfully updated on mirrors.
 * Eventually we want this to put up a banner saying 'saved' that fades out.
 * Right now we run a log in the console.
 * @param {string} message - The success message
 */
exports.successNotice = function(message) {
  console.log(message);
};

/**
 * Runs when a component fails to update on mirrors.
 * Eventually we want this to put up a banner saying 'failed' that fades out.
 * We should consider replacing this w/ the EnvConfig error handling
 * @param {string} message - The success message
 */
exports.failureNotice = function(error) {
  console.log(error);
};

/**
 * gives the upload image form appropriate event handlers
 * @param {string} html - The html of the form
 * @param {function} callback - What to do once an image is created, called w/ the image component
 * @returns {element} form - the jquery element w/ events attached
 */
exports.createImageForm = function(html, callback) {
  var form = $(html);
  form.on('submit', function() {
    //turn image into something we can make data eat
    var component = new api.Component();
    component.content_type =  ''; //Get file type
    component.data.data = ''; //Read file
    component.create().then(function() {
      component.update().then(function() {
        callback(component);
      });
    });
    return false;
  });
  return form;
};

/**
 * gives the select component form appropriate event handlers
 * @param {string} html - The html of the form
 * @param {function} callback - What to do once a component is selected, called w/ the component
 * @param {object} filter - What kinds of components should be selectable
 * @returns {string} slug - the slug of the component selected
 */
exports.selectComponent = function(html, callback, filter) {
  var form = $(html);
  form.on('submit', function() {
    var component = new api.Component(form.find('[name="slug"]').val());
    callback(component);
    return false;
  });
  return form;
};

/**
 * gives the edit image form appropriate event handlers
 * @param {string} html - The html of the form
 * @param {function} callback - What to do once an image is done being edited, called w/ the image component
 * @returns {element} form - the form w/ appropriate event handlers
 */
exports.editImageForm = function(html, component, callback) {
  var form = $(html);
  form.on('submit', function() {
    //FIXME for each type of thing update this component
    component.update().then(function() {
      callback(component);
    });
    return false;
  });
  return form;
};

/**
 * gives the create list form appropriate event handlers
 * @param {string} html - The html of the form
 * @param {function} callback - What to do after list creation, called w/ the new component
 * @return {element} form - the form w/ appropriate event handlers
 */
exports.createList = function(html, callback) {
  var form = $(html);
  var component = new api.Component();
  form.on('submit', function() {
    component.create(function(component) {
      callback(component);
    });
    return false;
  });
  return form;
}
