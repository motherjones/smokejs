/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');


/**
 * Add create and update methods to component objects
 * @module edit_api
 */

exports.Component = require('./api').Component;

/**
 * Tells mirrors to make a new component and give us a slug for it
 * @param {function} callback - callback is called with server response
 * @returns {promise} Resolves when complete
 */
exports.create = function(callback) {
  var self = this;
  console.log('problay goin wrong here');
  var promise = new Promise(function(resolve, reject) {
    var cb = function(data) {
      console.log('in cb');
      self.slug = data.slug;
      console.log('set self slug');
      callback(data);
    };
    console.log('made cb');
    request({ 
      method: 'POST',
      uri: EnvConfig.MIRRORS_URL + 'component/',
      json: { 
        attributes : self.attributes,
        metadata: self.metadata
      }
    }, self._success(cb, resolve, reject));
    console.log('request sent off');
  });
  return promise;
};
exports.Component.prototype.create = exports.create;

/**
 * Tells mirrors to update a component's attributes and metadata
 * @param {function} callback - callback is called with server response
 * @returns {promise} Resolves when complete
 */
exports.update = function(callback) {
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
exports.Component.prototype.update = exports.update;

/**
 * Helper function to create the callback from mirrors requests
 * @param {function} callback - callback is called with server response
 * @param {function} resolve - function to call to resolve update or create's promise
 * @param {function} reject - function to call to reject update or create's promise
 * @returns {function} The function to be called after update or create requests
 */
exports._success = function(callback, resolve, reject) {
  return function(err, result, body) {
    console.log('in success');
    if (result.statusText === "OK") {
      console.log(body);
      if (typeof(Storage)!=="undefined" ) {
        localStorage.setItem(body.slug, body);
      }
      callback(body);
      resolve();
    } else {
      console.log('lol here wat');
      EnvConfig.ERROR_HANDLER(err); 
      reject();
    }
  };
};
exports.Component.prototype._success = exports._success;
