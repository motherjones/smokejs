/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');
  var Markdown = require('./markdown');
  var $ = require('jquery');

  var Model = HiveMind.Model.extend({
    loaded: null,
    schema: 'contentModel',
    load: function() {
      if (this.loaded) { //already has a promise, is being loaded
        return this.loaded;
      }
      var self = this;
      self.loaded = new $.Deferred();
      $.get(
        EnvConfig.DATA_STORE + self.get('data_uri'),
        function(data) {
          var content = Markdown.toHTML(data);
          var contentTemplate = HiveMind.Dust.compile(content, self.get('data_uri'));
          HiveMind.Dust.loadSource(contentTemplate);
          self.set('template', self.get('data_uri'));
          self.loaded.resolve();
        }
      );
      return self.loaded; 
    },
    init: function() {
    },
    defaults: {
      template: 'article',
    }
  });

  var View = HiveMind.View.extend({
  });

  var Content = {
    View: View,
    Model: Model,
  };
  
  HiveMind.possibleAssets['content'] = Content;

  return Content;

})();
