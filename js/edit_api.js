/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');

exports.post = function(data, callback) {
  var promise = new Promise(function(resolve, reject) {
    console.log('in post promise');
    request({ 
      method: 'POST',
      uri: EnvConfig.MIRRORS_URL + 'component/',
      json: data
    }, exports._success(callback, resolve, reject)
    );
  });
  return promise;
};

exports.patch = function(data, callback) {
  var promise = new Promise(function(resolve, reject) {

    if (typeof(Storage)!=="undefined" ) {
      localStorage.setItem(data.slug, JSON.stringify(data));
    }

    request({ 
      method: 'PATCH',
      uri: EnvConfig.MIRRORS_URL + 'component/' + data.slug + '/',
      json: data
    }, exports._success(callback, resolve, reject)
    );
  });
  return promise;
};

exports._success = function(callback, resolve, reject) {
  console.log('making success callback');
  return function(err, result, body) {
    console.log('in success callback');
    console.log(result);
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
