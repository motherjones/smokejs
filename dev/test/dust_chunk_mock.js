/*global window */
'use strict';

module.exports = (function() {
  var $ = require('jquery');
  
  var chunk = function() {
    return { 
      map : function(callback) {
        this.promise = new $.Deferred(); 
        callback(this);
        return this.promise;
      },
      end : function(html) {
        this.output = html;
        this.promise.resolve();
      }
    };
  };
  return chunk;
})();
