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
    initialize: function(options) {
      this.url = this.urlRoot() + options.id;
    },
    urlRoot: function() {
      return EnvConfig.DATA_STORE + 'article_list/';
    },
    template: 'topic',
    model: Model,
  });

  var CollectionView = HiveMind.CollectionView.extend({
  });

  var Article = {
    'View': View,
    'Model': Model,
    'Collection': Collection,
    'CollectionView': CollectionView,
  };

  HiveMind.possibleAssets['article'] = Article;

  return Article;

})();

