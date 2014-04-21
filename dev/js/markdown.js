/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');
  var $ = require('jquery');

  var marked = require('marked');
  var markdown = {
    toHTML: marked,
    lexer: marked.lexer,
    parser: marked.parser
  };

  var Model = HiveMind.Model.extend({
    loaded: null,
    schema: 'markdownModel',
    load: function() {
      if (this.loaded) { //already has a promise, is being loaded
        return this.loaded;
      }
      var self = this;
      self.loaded = new $.Deferred();
      $.get(
        EnvConfig.DATA_STORE + self.get('data_uri'),
        function(data) {
          var html = markdown.toHTML(data);
          var markdownTemplate = HiveMind.Dust.compile(html, self.get('data_uri'));
          HiveMind.Dust.loadSource(markdownTemplate);
          self.set('template', self.get('data_uri'));
          self.loaded.resolve();
        }
      ).fail(function() {
        console.log('died loading markdown');
          var markdownTemplate = HiveMind.Dust.compile('markdown died', self.get('data_uri'));
          HiveMind.Dust.loadSource(markdownTemplate);
          self.set('template', self.get('data_uri'));
        self.loaded.resolve();
      });
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

  var Markdown = {
    View: View,
    Model: Model,
  };

  HiveMind.Markdown = Markdown;

  return Markdown;

})();
