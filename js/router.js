/*global document, history */
'use strict';
//In general please use exports.name for simplicity
//unless otherwise necessary not to.

/**
 * Sets up routes and deals with click hijacking and
 * adding content to the DOM.
 * @module router
 */
module.exports = (function() {
  var views = require('./views');
  var Router = require('routes');
  var Ad = require('./ad');
  var $ = require('jquery');
  var router = new Router();
  router.addRoute("/:schema/:slug", views.display_main_content);
  router.addRoute("^/$", views.display_homepage);
  /**
   * Takes path and runs view
   * @param {string} path - Url to lookup.
   * @return {promise} Promise returned by view.
   */
  router.pop = function(path) {
    console.log('in router pop, looking for ', path);
    var match = router.match(path);
    var returned = '';
    if(match) {
      returned = match.fn(match, router.callback);
    }
    return returned;
  };
  /**
   * Overwrite DEPENDING ON IF I'M IN A BROWSER OR NOT
   * @method callback
   * @param {object} data - Data returned mostly for testing.
   * @param {object} html - HTML to be inserted in DOM/string.
   */
  router.callback = function() {
    return null;
  };
  // STUFF FOR BROWSER
  router.browserStart = function() {
    $('body').on("click", "[href^='#/']", router.browserClick );
    router.callback = router.browserCallback;
    var path = document.location.hash.replace('#', '');
    router.pop(path);
  };
  router.browserClick = function(e) {
    var promise = new $.Deferred();
    e.preventDefault();
    var path = $(this).attr("href").replace('#', '');
    $.when(router.pop(path)).done(function(){
      history.pushState(0, 0, path);
      promise.resolve();
    });
    return promise;
  };
  router.browserCallback = function(data, html) {
    $('body').html(html);
    Ad.reload(data.keywords);
  };
  return router;
})();
