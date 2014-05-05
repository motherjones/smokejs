/*global module */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  var EnvConfig = require('./config');
  
  var API = {};

  API.load = function(slug, callback) {
    var promise = new $.Deferred();
    $.getJSON(EnvConfig.DATA_STORE + '/mirrors/component/' + slug,
      function(data) {
        console.log(callback);
        callback(data);
        promise.resolve();
      }
    );
    return promise;
  };

  return API;
})();
