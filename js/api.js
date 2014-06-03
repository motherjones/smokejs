'use strict';
var $ = require('jquery');
var EnvConfig = require('./config');
var Promise = require('promise-polyfill');

exports.component = function(slug, callback) {
  var promise = new Promise(function(resolve, reject) {
    if ( typeof(Storage)!=="undefined" && localStorage.getItem(slug) ) {
      callback(localStorage.getItem(slug));
      resolve();
    } else {
      $.getJSON(EnvConfig.DATA_STORE + 'component/' + slug,
        function(data) {
          if ( typeof(Storage)!=="undefined" ) {
            localStorage.setItem(slug, data);
          }
          callback(data);
          resolve();
        }
      );
    }
  })
  return promise;
};
