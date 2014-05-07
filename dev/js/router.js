/*global document, window */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var API = require('./api');
  var render = require('./render');
  var views = require('./views');
  var Ad = require('./ad');
  var Router = require('routes');

  var router = new Router();

  var start = function() {
    $('body').on("click", "[href^='#/']", function(e) {

      e.preventDefault();

      Riot.route($(this).attr("href"));

    });

    Riot.route(function(path) {
      path = path.replace('#\/', '');
      for (var key in Router.routes) {
        if (path.match(key)) {
          Router.routes[key].apply(this, path.split('/'));
          return;
        }
      }
    });

    Riot.route(document.location.hash);
  };

  router.addRoute('^[^/]+*/[^/]+$', views.display_homepage
  router.addRoute('^$', views.display_homepage);

  return router;

})();
