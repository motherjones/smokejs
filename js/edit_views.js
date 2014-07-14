var views = require('./views');
var $ = require('jquery');
require('./jquery.sortable');
var _ = require('lodash');
var api = require('./edit_api');
/**
 * Include views to be called by the router here each should
 * take a callback that takes in data, html
 * and returns a promise which is resolved after its loaded.
 * @module edit_views
 */

/**
 * Main view for rendering components and making them editable.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayMainContent = function(match, callback) {
  callback = callback ? callback : function() {};
//  var component;
  var cb = function(data, html) {
    var component = new api.Component(data.slug, data);
    html += exports._socialSharingElement(component);
    callback(data, html);
    exports._makeEditable(component);
  };
  return views.displayMainContent(match, cb);
};

/**
 * View for rendering the homepage and making it editable.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayHomepage = function(match, callback) {
  callback = callback ? callback : function() {};
  var homepage;
  var cb = function(data, html) {
    homepage = data;
    html += exports._socialSharingElement(component);
    callback(data, html);
    //make editable somehow
    // probably calling make editable on it? need to review the
    // splash page json
  };
  return views.displayHomepage(match, cb);
};

/**
 * helper function. If a single component, makes it's metadata, attributes
 * and main data editable. If an array (a list) makes the array sortable
 * adds a save buttton to the component
 * @param {component} component - The component we're making editable
 * @returns {void}
 */
exports._makeEditable = function(component) {
  for (var meta in component.metadata) {
    exports._editableMetadata(component, meta);
  }
  for (var name in component.attributes) {
    if (_.isArray( component.attributes[name] )) {
      exports._makeListEditable(name, component);
    } else {
      exports._makeEditable(component.attributes[name]);
    }
  }
  exports._editableData(component);
  $('#' + component.slug).append(exports._createSaveButton(component));
};

/**
 * helper function. Makes an array sortable
 * @param {string} name - The name of the array we're making sortable
 * @param {array} components - The component array we're making sortable
 * @returns {void}
 */
exports._makeListEditable = function(name, component) {
  var list = $('[data-attribute="' + name + '"][data-slug="' + component.slug + '"]');
  list.sortable().bind('sortupdate', function(e, ui) {
  });
  list.find('li').each(function() {
      exports._removeFromListButton(this, component);
  });
  list.append(exports._addToListButton(component));
  list.append(exports._createSaveListButton(name, component));
};

/**
 * function for creating a button that adds a new component to a list
 * @param {string} name - The name of the list we're adding to
 * @param {component} component - The list we're sorting
 * @returns {void}
 */
exports._addToListButton = function(name, component) {
  // allow editor to select and add a new thing to a list
};

/**
 * function for creating a button that removes a list item from a list
 * @param {element} item - The particular item the button is for
 * @param {string} name - The name of the list
 * @param {component} component - The list we're sorting
 * @returns {void}
 */
exports._removeFromListButton = function(item, name, component) {
  // make a button that will remove an item from html and from attribute
};

/**
 * function for creating a button that will save a list attribute
 * @param {string} name - The name of the attribute
 * @param {component} component - The component containing the list we're sorting
 * @returns {void}
 */
exports._createSaveListButton = function(name, component) {
};
/**
 * helper function. Makes data editable
 * @param {component} component - The component who's data we're making editable
 * @returns {void}
 */
exports._editableData = function(component) {
  console.log(component);
  // uhhh. welp
};

/**
 * helper function. Makes a metadata html element editable, and makes
 * changes on the component object when the content changes.
 * @param {component} component - The component who's metadata we're making editable
 * @param {string} meta - The name of the metadata we're making editable
 * @returns {void}
 */
exports._editableMetadata = function(component, meta) {
  $('.' + component.slug + '.' + meta)
    .attr('contentEditable', true)
    .on('blur', function() {
      component.metadata[meta] = $(this).text();
    });
};

/**
 * helper function. creates a panel from which editors can change component
 * metadata related to social sharing
 * @param {component} component - The component who's social data we're editing
 * @param {string} meta - The name of the metadata we're making editable
 * @returns {string} html - the raw html of the social sharing element
 */
exports._socialSharingElement = function(component) {
  return "<div><h4>this could one day be an edit popup or something" + component.slug + "</h4></div>";
};

/**
 * helper function. creates the button that updates a component on click
 * @param {component} component - The component that will be updated
 * @returns {element} button - the jQuery element that will update a component on click
 */
exports._createSaveButton = function(component) {
  return $('<button>Save</button>')
    .click(function() {
      component.update().then(
        exports._successNotice,
        exports._failureNotice
      );
    }
  );
};

/**
 * helper function. Runs when a component is successfully updated
 * eventually we want this to put up a banner saying 'saved' that fades out
 * @param {string} message - The success message
 */
exports._successNotice = function(message) {
  console.log('updated successfully', message);
};

/**
 * helper function. Runs when a component fails to update
 * eventually we want this to put up a banner saying 'failed' that fades out
 * we should consider replacing this w/ the EnvConfig error handling
 * @param {string} message - The success message
 */
exports._failureNotice = function(error) {
  console.log('updating failed!', error);
};
