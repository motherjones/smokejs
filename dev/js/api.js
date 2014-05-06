/*global module */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var EnvConfig = require('./config');
  
  var API = {};

  API.load = function(slug, callback) {
    var promise = new $.Deferred();
    $.getJSON(EnvConfig.DATA_STORE + slug,
      function(data) {
        console.log('load in api done');
        console.log(callback);
        callback(data);
        console.log('callback in api done');
        promise.resolve();
      }
    );
    return promise;
  };

  return API;
})();
