/*global define */
'use strict';

(function(define) {

    define([], function() {
        return {
            DATA_STORE : 'http://localhost:8000/api/v1/',
            ERROR_HANDLER : function(err) { console.log(err); },
        }
    });

})(define);
