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
  callback = callback ? callback : function() {};
  var cb = function(data, html) {
    var component = new api.Component(data.slug, data);
    html += editor.socialSharingElement(component);
    callback(data, html);
    editor.makeEditable(component);
  };
  return views.displayMainContent(match, cb);
};
