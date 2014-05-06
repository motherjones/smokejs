/*global module, document, window */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var API = require('./api');
  var render = require('./render');
  var Ad = require('./ad');
  var Riot = require('riotjs');
  //FIX ME FFS shm this or something ugh fuck you riot, fuck you browserify
  Riot.route = Riot.route ? Riot.route : window.riot.route;

  var Router = {};

  Router.start = function() {
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

  // "^[^/]+*/[^/]+$" : "display_main_content",
  var display_main_content = function(schema, slug) {
    API.load('/mirrors/component/' + slug, function(data) {
      render(schema, data, function(html) {
        $('body').html(html);
        Ad.reload(data.keywords);
      });
    });
  };

  //"^$" : "display_homepage",
  var display_homepage = function() {
    API.load('/homepage', function(data) {
      render('homepage', data, function(html) {
        $('body').html(html);
        Ad.reload(data.keywords);
      });
    });
  };

  Router.routes = {
      "^$" : display_homepage,
      "^[^\/]+/[^\/]+$" : display_main_content,
  };

  return Router;

})();
