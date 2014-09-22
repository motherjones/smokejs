var views = require('./views');
var editor = require('./editor');
var api = require('./edit_api');
/**
 * Includes views to be called by the router.
 * Each should take a callback that takes in data, and html.
 * Each should return a promise which is resolved after components are loaded
 * @module edit_views
 */

/**
 * Main view for rendering components and making them editable.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayMainContent = function(match, callback) {
    $('body').append(editor.socialSharingElement(component));
    editor.makeEditable(component);
    callback(match);
  };
};

/**
 * View for rendering the homepage and making it editable.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayHomepage = function(match, callback) {
    //make editable somehow
    // probably calling make editable on it? need to review the
    // splash page json
    callback(match);
};
