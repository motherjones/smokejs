/* global localStorage */
'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var $ = require('jquery');

exports.component = function(slug, callback) {
  var promise = new $.Deferred();
  if (typeof(Storage)!=="undefined" &&
      localStorage.getItem(slug) &&
      typeof JSON.parse( localStorage.getItem(slug) ) === 'object'
  ) {
    callback( JSON.parse( localStorage.getItem(slug) ) );
    promise.resolve();
  } else {
    request({ 
      method: 'GET',
      uri: EnvConfig.DATA_STORE + 'component/' + slug + '/',
      json: true
    }, function(err, result, body) {
      if (result.statusText === "OK") {
        if ( typeof(Storage)!=="undefined" ) {
          localStorage.setItem(slug, JSON.stringify(body));
        }
        callback(body);
        promise.resolve();
      } else {
        EnvConfig.ERROR_HANDLER(err); 
      }
    });
  }
  return promise;
};
