/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var $ = require('jquery');

exports.post = function(data, callback) {
  var promise = new $.Deferred();
  request({ 
    method: 'POST',
    uri: EnvConfig.DATA_STORE + 'component/',
    json: data
  }, exports.success(callback, promise)
  );
  return promise;
};

exports.patch = function(data, callback) {
  var promise = new $.Deferred();

  if (typeof(Storage)!=="undefined" ) {
    localStorage.setItem(data.slug, JSON.stringify(data));
  }

  request({ 
    method: 'PATCH',
    uri: EnvConfig.DATA_STORE + 'component/' + data.slug + '/',
    json: data
  }, exports.success(callback, promise)
  );
  return promise;
};

exports._success = function(callback, promise) {
  return function(err, result, body) {
    if (result.statusText === "OK") {
      var data = JSON.stringify(body);
      if (typeof(Storage)!=="undefined" ) {
        localStorage.setItem(data.slug, data);
      }
      callback(data);
      promise.resolve();
    } else {
      EnvConfig.ERROR_HANDLER(err); 
    }
  };
};
