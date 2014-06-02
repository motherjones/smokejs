'use strict';
var $ = require('jquery');
var EnvConfig = require('./config');

exports.component = function(slug, callback) {
  var promise = new $.Deferred();
  if ( typeof(Storage)!=="undefined" && false ) {
    callback(localStorage.getItem(slug));
    promise.resolve();
  } else {
    $.getJSON(EnvConfig.DATA_STORE + 'component/' + slug,
      function(data) {
        if ( typeof(Storage)!=="undefined" ) {
          localStorage.setItem(slug, data);
        }
        callback(data);
        promise.resolve();
      }
    );
  }
  return promise;
};
