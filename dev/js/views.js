/*global require */
'use strict';

var $ = require('jquery');

var Ad = require('./ad');
var API = require('./api');
var render = require('./render');

exports.display_main_content = function(match, callback) {
  var promise = new $.Deferred();
  API.load('/mirrors/component/' + match.params.slug, function(data) {
    render(match.params.schema, data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      if (callback) { callback(data, html) };
      promise.resolve();
    });
  });
  return promise;
};

exports.display_homepage = function(callback) {
  var promise = new $.Deferred();
  API.load('/home-page', function(data) {
    render('homepage', data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      if (callback) { callback(data, html) };
      promise.resolve();
    });
  });
  return promise;
};
