/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');

  var Model = HiveMind.Model.extend({
    urlRoot: function() {
      return EnvConfig.DATA_STORE + 'splashpage/';
    },
    defaults: {
      template: 'homepage',
    }
  });

  var View = HiveMind.View.extend({
  });

  var SplashPage = {
      'View': View,
      'Model': Model,
  };

  HiveMind.possibleAssets['splashpage'] = SplashPage;

  return SplashPage;
})();


