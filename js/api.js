/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');


/**
 * Currently, a component object with a get function
 * @module api
 */

exports.Component = function(slug) {
  this.slug = slug;
};

/**
 * Checks localstorage for the component's data, calls out to mirrors if 
 * localstorage doesn't have it or is stale
 * @param {function} callback - callback is called with the component's data
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype.get = function(callback) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    if ( typeof(Storage)!=="undefined" && 
        localStorage.getItem(self.slug) &&
        localStorage.getItem(self.slug) !== '[object Object]'
      ) {
      var data = JSON.parse(localStorage.getItem(self.slug)); 
      var millisecondsPerHour = 3600000;
      if ( data.lastUpdated + (millisecondsPerHour * 3) > new Date().getTime()) {
        callback(data);
        resolve();
        return;
      }
    }
    request(
      EnvConfig.MIRRORS_URL + 'component/' + self.slug + '/',
      function(error, response, body) {
        if (response.statusText === "OK") {
          var data = JSON.parse(body);
          if ( typeof(Storage)!=="undefined") {
            data.lastUpdated = new Date().getTime();
            localStorage.setItem(self.slug, JSON.stringify(data));
          }
          self.attributes = data.attributes;
          self.metadata = data.metadata;
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
