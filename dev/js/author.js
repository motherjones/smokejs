/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');

  var Model = HiveMind.Model.extend({
    urlRoot: function() {
      return EnvConfig.DATA_STORE;
    },
    schema: 'authorModel',
    defaults: {
      template: 'author',
    }
  });

  var View = HiveMind.View.extend({
  });

  var Collection = HiveMind.Collection.extend({
    urlRoot: function() {
      return EnvConfig.DATA_STORE;
    },
    template: 'byline',
    model: Model,
  });

  var CollectionView = HiveMind.CollectionView.extend({
  });

  var Author = {
    'View': View,
    'Model': Model,
    'Collection': Collection,
    'CollectionView': CollectionView,
  };

  HiveMind.possibleAssets['author'] = Author;

  return Author;

})();
