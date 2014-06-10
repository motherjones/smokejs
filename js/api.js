/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');

var Component = function(slug) {
  this.slug = slug;
});

Component.prototype.get = function(callback) {
  var promise = new Promise(function(resolve, reject) {
    if ( typeof(Storage)!=="undefined" && localStorage.getItem(this.slug) &&
        localStorage.getItem(this.slug) !== '[object Object]'
      ) {
      callback(JSON.parse(localStorage.getItem(this.slug)));
      resolve();
    } else {
      var self = this;
      request(EnvConfig.MIRRORS_URL + 'component/' + this.slug + '/',
        function(error, response, body) {
          if (response.statusText === "OK") {
            if ( typeof(Storage)!=="undefined") {
              localStorage.setItem(self.slug, body);
            }
            var data = JSON.parse(body);
            self.attributes = data.attributes;
            self.metadata = data.metadata;
            callback(data);
            resolve();
          } else {
            EnvConfig.ERROR_HANDLER(error); 
            reject();
          }
        });
    }
  });
  return promise;
};

module.exports = Component
