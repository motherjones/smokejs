'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');

/**
 * Currently, a component object with a get function
 * @module api
 */


/**
 * Component constructor
 * @class
 * @param {string} slug the id of the componet
 */
exports.Component = function(slug, data) {
  this.slug = slug;
  this.attributes = [];
  this.metadata = {};
  if (data) {
    this.metadata = data.metadata;
    this.attributes = data.attributes;
  };
  this.changed = {};
};

/**
 * Checks localstorage for the component's data, calls out to mirrors if
 * localstorage doesn't have it or is stale
 * @function
 * @param {function} callback - is called after the GET request for the component completes with the JSON as the first argument
 * @param {boolean} pull - don't check local storage, pull from mirrors
 * @returns {promise} resolves after the callback is complete, fails on error
 */
exports.Component.prototype.get = function(callback, pull) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    request(
      EnvConfig.MIRRORS_URL + 'component/' + self.slug + '/',
      function(error, response, body) {
        if (response.statusText === "OK") {
          try {
            data = JSON.parse(body);
          } catch(e) {
            EnvConfig.log(e);
            reject();
          }
          for (var i in data) {
            self[i] = data[i];
          }
          callback(data);
          resolve();
        } else {
          EnvConfig.ERROR_HANDLER(error);
          reject();
        }
      }
    );
  });
  return promise;
};
