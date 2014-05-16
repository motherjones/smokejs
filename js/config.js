'use strict';

//exports.DATA_STORE = 'http://localhost:8000/api/v1/';
exports.DATA_STORE = 'http://localhost:9001/mirrors/';
//exports.DATA_STORE : 'http://fiori.fnp.private:8080';

exports.AD_LOCATION = 'http://mj-tech.s3.amazonaws.com/ad_w_intersitial.html';

exports.MEDIA_STORE = 'http://localhost:8000'; // CHANGEME MAKE ME REAL

exports.ERROR_HANDLER = function(err) {
  console.log(err);
  console.log(err.stack);
};
