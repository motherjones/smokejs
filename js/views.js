/*global require */
'use strict';
var API = require('./api');
var render = require('./render');
var Promise = require('promise-polyfill');

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
 * @returns {promoise} Resolves when complete
 */
exports.display_main_content = function(match, callback) {
  //TODO: Make the promise and callback stuff a boiler plate function
  console.log('in display main content');
  var promise = new Promise(function (resolve, reject) {
    API.component(match.params.slug, function(data) {
      render.render(match.params.schema, data, function(html) {
        if (callback) { callback(data, html); }
        resolve();
      });
    });
  });
  return promise;
};

/**
 * View which renders the homepage.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promoise} Resolves when complete
 */
exports.display_homepage = function(callback) {
  console.log('in display homepage');
  var promise = new Promise(function(resolve, reject) {
    API.component('homepage', function(data) {
      render.render('homepage', data, function(html) {
        if (callback) { callback(data, html); }
        resolve();
      });
    });
  });
  return promise;
};
