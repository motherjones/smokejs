'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var EnvConfig = require('./config');
  var storage = require('./libs/Lawnchair');
  
  console.log(storage);
  var API = {};

  API.load = function(slug, callback) {
    var promise = new $.Deferred();
    $.getJSON(EnvConfig.DATA_STORE + slug,
      function(data) {
        callback(data);
        promise.resolve();
      }
    );
    return promise;
  };

  return API;
})();
