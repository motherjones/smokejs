/*global document, history */
'use strict';
var views = require('./views');
var Router = require('routes');
var Ad = require('./ad');
var $ = require('jquery');
var Promise = require('promise-polyfill');

//In general please use exports.name for simplicity
//unless otherwise necessary not to.

/**
 * Sets up routes and deals with click hijacking and
 * adding content to the DOM.
 * @module router
 */
module.exports = (function() {
  var router = new Router();
  router.addRoute("/:schema/:slug", views.display_main_content);
  router.addRoute("^/$", views.display_homepage);
  return router;
})();

/**
  * Takes path and runs view
  * @alias pop
  * @memberof module:router
  * @param {string} path - Url to lookup.
  * @return {returned} Promise returned by view.
  */
module.exports.pop = function(path) {
  console.log('in router pop, looking for ', path);
  var match = module.exports.match(path);
  var returned = '';
  if(match) {
    returned = match.fn(match, module.exports.callback);
  }
  return returned;
};

/**
  * Overwrite DEPENDING ON IF I'M IN A BROWSER OR NOT
  * @alias callback
  * @memberof module:router
  * @param {object} data - Data returned mostly for testing.
  * @param {object} html - HTML to be inserted in DOM/string.
  */
module.exports.callback = function() {
  return null;
};

/**
  * Set up click and callback events for the browser
  * @alias browserStart
  * @memberof module:router
  */
module.exports.browserStart = function() {
  $('body').on("click", "[href^='#/']", module.exports.browserClick );
  module.exports.callback = exports.browserCallback;
  var path = document.location.hash.replace('#', '');
  module.exports.pop(path);
};

/**
  * Handles the hyperlink click events for browsers
  * @alias browserClick
  * @memberof module:router
  * @param {event} e - The click event
  * @return {promise} Promise resolved after history push
  */
module.exports.browserClick = function(e) {
  e.preventDefault();
  var path = $(this).attr("href").replace('#', '');
  var promise = new Promise(function(resolve) {
    module.exports.pop(path);
    history.pushState(0, 0, path);
    resolve();
  });
  return promise;
};

/**
  * Method called after the page html has been constructed
  * @alias browserCallback
  * @memberof module:router
  * @param {data} object - the page data
  * @param {html} string - the rendered page html
  */
exports.browserCallback = function(data, html) {
  $('body').html(html);
  Ad.reload(data.keywords);
};
