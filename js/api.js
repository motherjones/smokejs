'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');

exports.component = function(slug, callback) {
  var promise = new Promise(function(resolve, reject) {
    if ( typeof(Storage)!=="undefined" && localStorage.getItem(slug) &&
        localStorage.getItem(slug) !== '[object Object]'
      ) {
      callback(JSON.parse(localStorage.getItem(slug)));
      resolve();
    } else {
      request(EnvConfig.MIRRORS_URL + 'component/' + slug,
        function(error, response, data) {
          if ( typeof(Storage)!=="undefined" && false ) {
            localStorage.setItem(slug, data);
          }
          callback(JSON.parse(data));
          resolve();
        }
      );
    }
  })
  return promise;
};
