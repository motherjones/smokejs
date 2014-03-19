/*global module */
'use strict';

module.exports = (function() {

  return {
    DATA_STORE : 'http://localhost:8000/api/v1/',
    AD_LOCATION : 'http://localhost:9001/fixtures/ad.html',
    MEDIA_STORE : 'http://localhost:8000', // CHANGEME MAKE ME REAL
    ERROR_HANDLER : function(err) { console.log(err); }, //CHANGEME MAKE ME LOG TO SOMEWHERE ELSE
  };
});

