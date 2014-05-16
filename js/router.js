/*global document, history */
'use strict';

var views = require('./views');
var Router = require('routes');
var Ad = require('./ad');
var $ = require('jquery');

exports.router = new Router();
exports.match = exports.router.match;
exports.addRoute = exports.router.addRoute;

exports.router.addRoute("/:schema/:slug", views.display_main_content);
exports.router.addRoute("^/$", views.display_homepage);

exports.pop = exports.router.pop = function(path) {
  console.log('in router pop, looking for ', path);
  var match = exports.router.match(path);
  var returned = '';
  if(match) {
    returned = match.fn(match, exports.router.callback);
  }
  return returned;
};

exports.callback = exports.router.pop = function() {
  //I EXIST TO OVERWRITTEN AS APPROPRIATE DEPENDING ON IF I'M IN A BROWSER OR NOT
  return null;
};
// STUFF FOR BROWSER
exports.browserStart = function() {
  $('body').on("click", "[href^='#/']", exports.router.browserClick );
  exports.callback = exports.browserCallback;
  var path = document.location.hash.replace('#', '');
  exports.pop(path);
};
exports.browserClick = function(e) {
  var promise = new $.Deferred();
  e.preventDefault();
  var path = $(this).attr("href").replace('#', '');
  $.when(exports.pop(path)).done(function(){
    history.pushState(0, 0, path);
    promise.resolve();
  });
  return promise;
};
exports.browserCallback = function(data, html) {
  $('body').html(html);
  Ad.reload(data.keywords);
};
