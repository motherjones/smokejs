'use strict';
var _ = require('lodash');

module.exports = (function() {
  var localConfig = {};
  try {
    localConfig = require('../localConfig.js');
  } catch(e) {
  }
  var defaultConfig = {
    ERROR_HANDLER: function(err) {
      //console.log(err);
      if (err && 'stack' in err) {
        //console.log(err.stack);
      }
    },
    log: function(str) {
      console.log(str);
    }
  };
  return _.merge(defaultConfig, localConfig);
})();
