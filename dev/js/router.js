/*global document, history */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var views = require('./views');
  var Router = require('routes');

  var router = new Router();
  router.addRoute("/:schema/:slug", views.display_main_content);
  router.addRoute("^/$", views.display_homepage);
  var pop = function(path) {
    var match = router.match(path);
    return match.fn(match);
  };

  router.browserStart = function() {
    $('body').on("click", "[href^='#/']", function(e) {
      e.preventDefault();
      var path = document.location.hash.replace('#', '');
      $.when(pop(path)).done(function(){
        history.pushState(0, 0, path);
      });
    });
    var path = document.location.hash.replace('#', '');
    pop(path)
  };
  return router;

})();
