/*global module */
'use strict';

module.exports = (function() {
  var Story = require('./story');
  var HiveMind = require('./hivemind');

  var Model = Story.Model.extend({
  });

  var View = Story.View.extend({
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
      this.model.set('title', this.$('input.title').val());
      this.modelChanged({title: this.$('input.title').val()});
    },
    dekChanged : function() {
      this.model.set('dek', this.$('input.dek').val());
      this.modelChanged({dek: this.$('input.dek').val()});
    },
    modelChanged: function(changes) {
      //BE MORE SMART
      this.model.save(changes, { patch: true });
      
    },
  });

  var Collection = Story.Collection.extend({
  });

  var CollectionView = Story.CollectionView.extend({
  });

  var EditStory = {
    'View': View,
    'Model': Model,
    'Collection': Collection,
    'CollectionView': CollectionView,
  };

  HiveMind.possibleAssets['story'] = EditStory;

  return EditStory;

})();
