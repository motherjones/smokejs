/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var $ = require('jquery');

  var Model = HiveMind.Model.extend({
    defaults: {
      template: 'homepage',
      content: null,
    }
  });

  var View = HiveMind.View.extend({
    load: function() { 
      this.loaded = new $.Deferred();
      this.loaded.resolve();
      return this.loaded;
    },
    initialize: function() {
                  /*
      this.listenTo(this.model, 'change:id', function() {
        this.loaded = null;
        this.load();
      });
      */
      this.listenTo(this.model, 'change:template', function() {
        this.render();
      });
    },
  });

  return {
    'View': View,
    'Model': Model,
  };
})();
