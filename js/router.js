/*global window, document */
'use strict';
var views = require('./views');
var Router = require('routes');
var ad = require('./ad');
var $ = require('jquery');
var _ = require('lodash');
var Promise = require('promise-polyfill');
var errors = require('./errors');

//In general please use exports.name for simplicity
//unless otherwise necessary not to.

/**
 * Sets up routes and deals with click hijacking and
 * adding content to the DOM.
 * @module router
 */
module.exports = (function() {
  var router = new Router();
  return router;
})();

module.exports.addRoutes = function(routes) {
  _(routes).forEach(function(view, route) {
    module.exports.addRoute(route, view);
  });
  return module.exports;
};

/**
  * Takes path and runs view
  * @alias pop
  * @memberof module:router
  * @param {string} path - Url to lookup.
  * @return {returned} Promise returned by view.
  */
module.exports.pop = function(path) {
  var match = module.exports.match(path);
  var returned = '';
  if(match) {
    returned = match.fn(match, module.exports.callback);
  }
  return returned;
};

/**
  * Overwrite DEPENDING ON IF I'M IN A BROWSER OR NOT
  * Called after a view gets rendered html
  * @alias callback
  * @abstract
  * @memberof module:router
  * @param {object} data - Data returned mostly for testing.
  * @param {object} html - HTML to be inserted in DOM/string.
  */
module.exports.callback = function() {
  throw new errors.NotImplementedError();
}

/**
  * Set up click and callback events for the browser
  * @alias browserStart
  * @memberof module:router
  */
module.exports.browserStart = function() {
  console.log('browserStart\n\n\ntest');
  $('body').on("click", "[href^='/']", module.exports.browserClick );
  $(window).on('popstate', function(e) {
    module.exports.pop(document.location.pathname);
  });
  ad.setAdListener();
  module.exports.callback = module.exports.browserCallback;
  module.exports.pop(document.location.pathname);
};

/**
  * Handles the hyperlink click events for browsers
  * @alias browserClick
  * @memberof module:router
  * @param {event} e - The click event
  * @return {promise} Promise resolved the router runs the appropriate function
  */
module.exports.browserClick = function(e) {
  e.preventDefault();
  var promise = new Promise(function(resolve) {
    module.exports.pop($(e.target).attr('href'));
    window.history.pushState(0, 'Mother Jones', $(e.target).attr('href'));
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
module.exports.browserCallback = function(match, html, title) {
  if(html) {
    $('body').html(html);
  }
  if (title) {
    document.title = 'MotherJones - ' + title;
  };
  var match = match.next();
  var keywords = [];
  if(match) {
    match.fn(match, module.exports.callback);
    if ('component' in match) {
      if ('section' in match.component.metadata) {
        keywords.push(match.component.metadata.section);
      }
    }
  }
  ad.reload(keywords);
};
