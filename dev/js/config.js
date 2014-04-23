/*global module */
'use strict';

module.exports = (function() {

  return {
//        DATA_STORE : 'http://localhost:8000/api/v1/',
    DATA_STORE : 'http://localhost:9001/fixtures',
    //DATA_STORE : 'http://fiori.fnp.private:8080',
    AD_LOCATION : 'http://mj-tech.s3.amazonaws.com/ad_w_intersitial.html',
    MEDIA_STORE : 'http://localhost:8000', // CHANGEME MAKE ME REAL
    ERROR_HANDLER : function(err) { 
      console.log(err);
      console.log(err.stack);
    },
  };

})();
