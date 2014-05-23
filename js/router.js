/*global document, history */
'use strict';
//In general please use exports.name for simplicity
//unless otherwise necessary not to.
module.exports = (function() {
  var views = require('./views');
  var Router = require('routes');
  var Ad = require('./ad');
  var $ = require('jquery');
  var router = new Router();
  router.addRoute("/:schema/:slug", views.display_main_content);
  router.addRoute("^/$", views.display_homepage);
  router.pop = function(path) {
    console.log('in router pop, looking for ', path);
    var match = router.match(path);
    var returned = '';
    if(match) {
      returned = match.fn(match, router.callback);
    }
    return returned;
  };
  router.callback = function() {
    //I EXIST TO OVERWRITTEN AS APPROPRIATE DEPENDING ON IF I'M IN A BROWSER OR NOT
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
