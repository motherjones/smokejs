/*global require */
module.exports = (function() { 'use strict';
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
