'use strict';
var $ = require('jquery');
var EnvConfig = require('./config');
var Promise = require('promise-polyfill');

exports.component = function(slug, callback) {
  var promise = new Promise(function(resolve, reject) {
    if ( typeof(Storage)!=="undefined" && localStorage.getItem(slug) &&
        localStorage.getItem(slug) !== '[object Object]'
      ) {
      callback(JSON.parse(localStorage.getItem(slug)));
      resolve();
    } else {
      $.getJSON(EnvConfig.MIRRORS_URL + 'component/' + slug,
        function(data) {
          if ( typeof(Storage)!=="undefined" ) {
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
