/*global define */
'use strict';

(function(define) {

    define([], function() {
        return {
            DATA_STORE : 'http://localhost:8000/api/v1/',
            MEDIA_STORE : 'http://localhost:8000', // CHANGEME MAKE ME REAL
            ERROR_HANDLER : function(err) { console.log(err); }, //CHANGEME MAKE ME LOG TO SOMEWHERE ELSE
        }
    });

})(define);
