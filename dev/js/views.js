/*global exports */
'use strict';

var $ = require('jquery');

var Ad = require('./ad');
var API = require('./api');
var render = require('./render');

exports.display_main_content = function(match) {
  var promise = new $.Deferred();
  API.load('/mirrors/component/' + match.params.slug, function(data) {
    render(match.params.schema, data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      promise.resove();
    });
  });
  return promise;
};

exports.display_homepage = function(match, callback) {
  var promise = new $.Deferred();
  API.load('/homepage', function(data) {
    render('homepage', data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
      promise.resove();
    });
  });
  return promise;
};
