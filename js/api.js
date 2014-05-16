'use strict';
var $ = require('jquery');
var EnvConfig = require('./config');

exports.component = function(slug, callback) {
  var promise = new $.Deferred();
  $.getJSON(EnvConfig.DATA_STORE + 'component/' + slug,
    function(data) {
      callback(data);
      promise.resolve();
    }
  );
  return promise;
};
