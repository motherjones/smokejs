/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var Dust = require('../../build/js/edit_templates.js')();

  HiveMind.dust = Dust; //hivemind now has edit templates as well

  return HiveMind;

})();
