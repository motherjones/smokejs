/*global require */
'use strict';
var api = require('./api');
var render = require('./render');

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
exports.display_main_content = function(match, callback) {
  var component = new api.Component(match.params.slug);
  return component.get(function(data) {
    render.render(match.params.schema, data, function(html) {
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
exports.display_homepage = function(callback) {
  var component = new api.Component('homepage');
  return component.get(function(data) {
    render.render('homepage', data, function(html) {
      if (callback) { callback(data, html); }
    });
  });
};
