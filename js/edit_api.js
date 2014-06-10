/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');
var Component = require('./api');

Component.prototype.post = function(callback) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    var cb = function(data) {
      self.slug = data.slug;
      callback(data);
    };
    request({ 
      method: 'POST',
      uri: EnvConfig.MIRRORS_URL + 'component/',
      json: { 
        attributes : self.attributes,
        metadata: self.metadata
      }
    }, self._success(cb, resolve, reject)
    );
  });
  return promise;
};

Component.prototype.patch = function(callback) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    request({ 
      method: 'PATCH',
      uri: EnvConfig.MIRRORS_URL + 'component/' + self.slug + '/',
      json: {
        attributes: self.attributes,
        metadata: self.metadata
      }
    }, self._success(callback, resolve, reject)
    );
  });
  return promise;
};

Component._success = function(callback, resolve, reject) {
  return function(err, result, body) {
    if (result.statusText === "OK") {
      if (typeof(Storage)!=="undefined" ) {
        localStorage.setItem(body.slug, body);
      }
      callback(body);
      resolve();
    } else {
      EnvConfig.ERROR_HANDLER(err); 
      reject();
    }
  }
};

module.exports = Component
