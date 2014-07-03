'use strict';

exports.MIRRORS_DOMAIN = 'http://localhost:9001';
exports.MIRRORS_URI = '/mirrors/';
exports.MIRRORS_URL = exports.MIRRORS_DOMAIN + exports.MIRRORS_URI;

exports.AD_LOCATION = 'http://mj-tech.s3.amazonaws.com/ad_w_intersitial.html';

exports.MEDIA_STORE = 'http://localhost:8000'; // CHANGEME MAKE ME REAL

exports.log = function(str) {
  console.log(str);
};

// This is not static and shouldn't be caps
exports.ERROR_HANDLER = function(err) {
  //console.log(err);
  if (err && 'stack' in err) {
    //console.log(err.stack);
  }
};
