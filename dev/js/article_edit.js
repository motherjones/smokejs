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
      console.log('FIXME comp change');
    },
    titleChanged : function() {
      console.log('setting new title');
      this.model.set('title', this.$('input.title').val());
      this.modelChanged({title: this.$('input.title').val()});
    },
    dekChanged : function() {
      console.log('setting new dek');
      this.model.set('dek', this.$('input.dek').val());
      this.modelChanged({dek: this.$('input.dek').val()});
    },
    modelChanged: function(changes) {
      //BE MORE SMART
      console.log('model has been changed and should save now');
      this.model.save(changes, { patch: true });
      
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
