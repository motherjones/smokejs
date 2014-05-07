'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var Ad = require('./ad');
  var API = require('./api');
  var render = require('./render');

  var views = {};

  views.display_main_content = function(match, callback) {
    var promise = new $.Deferred();
    API.load('/mirrors/component/' + match.params.slug, function(data) {
      render(match.params.schema, data, function(html) {
        $('body').html(html);
        Ad.reload(data.keywords);
        callback();
        promise.resove();
      });
    });
    return promise;
  };

  views.display_homepage = function(match, callback) {
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

  return views;
})();
