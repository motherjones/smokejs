/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');

  var Model = HiveMind.Model.extend({
    defaults: {
      template: 'homepage',
      content: null,
    }
  });

  var View = HiveMind.View.extend({
  });

  return {
    'View': View,
    'Model': Model,
  };
})();
