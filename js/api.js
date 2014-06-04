'use strict';
var $ = require('jquery');
var EnvConfig = require('./config');
var request = require('browser-request');

exports.component = function(slug, callback) {
  var promise = new $.Deferred();
  if ( typeof(Storage)!=="undefined" && localStorage.getItem(slug) && false ) {
    callback(localStorage.getItem(slug));
    promise.resolve();
  } else {
    request(EnvConfig.MIRRORS_URL + 'component/' + slug,
      function(error, response, data) {
        data = JSON.parse(data);
        if ( typeof(Storage)!=="undefined" && false ) {
          localStorage.setItem(slug, data);
        }
        callback(data);
        promise.resolve();
      }
    );
  }
  return promise;
};
