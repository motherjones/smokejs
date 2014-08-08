/*global require */
'use strict';
var api = require('./api');
var render = require('./render');
var config = require('./config');

/**
 * Include views to be called by the router here each should
 * take a callback that takes in data, html
 * and returns a promise which is resolved after its loaded.
 * @module views
 */

/**
 * Main view for rendering components.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayMainContent = function(match, callback) {
  var component = new api.Component(match.params.slug);
  return component.get(function(data) {
    render.render(data.schema_name, data, function(html) {
      if (callback) { callback(data, html); }
    });
  });
};

/**
 * View which renders the homepage.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayHomepage = function(match, callback) {
  var component = new api.Component('homepage');
  return component.get(function(data) {
    render.render('homepage', data, function(html) {
      if (callback) { callback(data, html); }
    });
  });
};

/**
 * Displays style guide.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayStyleGuide = function(match, callback) {
  config.log('styleguide');
  return render.render('styleguide', {}, function(html) {
    if (callback) { callback({}, html); }
  });
};
