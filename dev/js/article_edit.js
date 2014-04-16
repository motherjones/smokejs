/*global module */
'use strict';

module.exports = (function() {
  var Article = require('./article');
  var HiveMind = require('./hivemind');

  var Model = Article.Model.extend({
  });

  var View = Article.View.extend({
    model: Model,
      events: {
        "change input.title":  "titleChanged",
        "change input.dek":  "dekChanged",
        "change textarea.component_body":  "componentChanged",
      },
    afterRender: function() {
      this.delegateEvents();
    },
    componentChanged : function() {
      console.log('comp change');
    },
    titleChanged : function() {
      console.log('setting new title');
      this.model.set('title', this.$('input.title').val());
      this.modelChanged();
    },
    dekChanged : function() {
      console.log('setting new dek');
      this.model.set('dek', this.$('input.dek').val());
      this.modelChanged();
    },
    modelChanged: function() {
      //BE MORE SMART
      console.log('model has been changed and should save now');
      this.model.sync();
      
    },
  });

  var Collection = Article.Collection.extend({
  });

  var CollectionView = Article.CollectionView.extend({
  });

  var EditArticle = {
    'View': View,
    'Model': Model,
    'Collection': Collection,
    'CollectionView': CollectionView,
  };

  HiveMind.possibleAssets['article'] = EditArticle;

  return EditArticle;

})();
