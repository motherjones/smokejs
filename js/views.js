/*global require */
'use strict';
var $ = require('jquery');
var API = require('./api');
var render = require('./render');

exports.display_main_content = function(match, callback) {
  console.log('in display main content');
  var promise = new $.Deferred();
  API.component(match.params.slug, function(data) {
    render(match.params.schema, data, function(html) {
      if (callback) { callback(data, html); }
      promise.resolve();
    });
  });
  return promise;
};

exports.display_homepage = function(callback) {
  console.log('in display homepage');
  var promise = new $.Deferred();
  API.component('homepage', function(data) {
    render('homepage', data, function(html) {
      if (callback) { callback(data, html); }
      promise.resolve();
    });
  });
  return promise;
};
