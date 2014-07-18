var $ = require('jquery');
require('./jquery.sortable');
var _ = require('lodash');

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
      exports.makeListEditable(name, component);
    } else {
      exports.makeEditable(component.attributes[name]);
    }
  }
  exports.editableData(component);
  $('#' + component.slug).append(exports.saveComponentButton(component));
};

/**
 * Makes an array sortable, it's members deletable, and gives it a save button
 * @param {string} name - The name of the array we're making sortable
 * @param {array} components - The component array we're making sortable
 * @returns {void}
 */
exports.makeListEditable = function(name, component) {
  var list = $('[data-attribute="' + name + '"][data-slug="' + component.slug + '"]');
  list.sortable().bind('sortupdate', function() {
    var newOrder = [];
    list.children('li').each(function() {
      newOrder.push($(this).data('slug'));
    });
    var attribute = [];
    for (var i = 0; i < newOrder.length; i++) {
      for (var j = 0; j < component.attributes[name].length; j++) {
        if (component.attributes[name][j].slug === newOrder[i]) {
          attribute.push(component.attributes[name][j]);
          break;
        }
      }
    }
    component.attributes[name] = attribute;
  });
  list.find('li').each(function() {
    $(this).append(exports.removeFromListButton($(this), component));
  });
  list.append(exports.addToListButton(component));
  list.append(exports.saveComponentButton(name, component));
};

/**
 * Creates a button that adds a new component to a list, both in the browser
 * and in the parent component.
 * FIXME this is a stub
 * @param {string} name - The name of the list we're adding to
 * @param {component} component - The list we're sorting
 * @returns {void}
 */
exports.addToListButton = function(name, component) {
  // allow editor to select and add a new thing to a list
};

/**
 * Creates a button that removes a list item from a list, and updates its
 * parent component to no longer have that item.
 * @param {element} item - The particular list item element the button is for
 * @param {string} name - The name of the list
 * @param {component} component - The parent of the attribute we're sorting
 * @returns {void}
 */
exports.removeFromListButton = function(item, name, component) {
  return $('<span class="remove-from-list">x</span>')
    .click(function() {
      _.remove(component, function(comp) {
        return item.data('slug') === comp.slug;
      });
      item.remove();
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
      component._updateAttribute(name).then(
        exports.successNotice,
        exports.failureNotice
      );
    });
};
/**
 * Make a component's data inline editable.
 * FIXME this is a stub
 * @param {component} component - The component who's data we're making editable
 * @returns {void}
 */
exports.editableData = function(component) {
  // uhhh. welp
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
        exports.successNotice,
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
};

/**
 * Runs when a component fails to update on mirrors.
 * Eventually we want this to put up a banner saying 'failed' that fades out.
 * We should consider replacing this w/ the EnvConfig error handling
 * @param {string} message - The success message
 */
exports.failureNotice = function(error) {
};
