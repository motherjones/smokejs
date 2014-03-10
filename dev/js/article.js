/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');

  var Model = HiveMind.Model.extend({
    urlRoot: function() {
      return EnvConfig.DATA_STORE + 'article/';
    },
    defaults: {
      template: 'article',
    }
  });

  var View = HiveMind.View.extend({
  });

  var Collection = HiveMind.Collection.extend({
    urlRoot: function() {
      return EnvConfig.DATA_STORE + 'article_list/';
    },
    defaults: {
      template: 'topic',
    }
  });

  var CollectionView = HiveMind.CollectionView.extend({
  });

  return {
    'View': View,
    'Model': Model,
    'Collection': Collection,
    'CollectionView': CollectionView,
  };
})();

