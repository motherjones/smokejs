/*global document, history */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var views = require('./views');
  var Router = require('routes');

  var router = new Router();

  router.browserStart = function() {
    $('body').on("click", "[href^='#/']", function(e) {
      e.preventDefault();

      var path = document.location.hash.replace('#\/', '');
      var match = router.match(path);

      match.fn(match);

      history.pushState(0, 0, path);
    });
    var path = document.location.hash.replace('#\/', '');
    console.log(path);
    var match = router.match(path);

    var callback = function() {};
    match.fn(match, callback);
  };

  router.addRoute('^[^/]+*/[^/]+$', views.display_main_content);
  router.addRoute('^$', views.display_homepage);

  return router;

})();
