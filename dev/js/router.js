/*global document, window */
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

      match.fn(match, callback);

    });
  };

  router.addRoute('^[^/]+*/[^/]+$', views.display_homepage);
  router.addRoute('^$', views.display_homepage);

  return router;

})();
