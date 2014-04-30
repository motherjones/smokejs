/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');
  var $ = require('jquery');

  var marked = require('marked');
   
  var renderer = new marked.Renderer();
  renderer.component_block = function (that) {
    //Return component html here
    // that.token.slug is the slug of the content
    // If we need more info we can pass it down.
    return that.token.slug;
  };
  var options = {
    'renderer': renderer,
    'extra_block_rules': {
      //Looks for pattern !!() we can switch to !!()[args] later
      component_block: /^!!\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]/
    },
    'extra_block_lexers': {
      component_block: function (cap) {
        return {
          type: 'component_block',
          slug: cap[1]
        };
      }
    }
  };
  marked.setOptions(options);
  var markdown = {
    toHTML: marked,
    lexer: function (md) {
      return marked.lexer(md, options);
    },
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

  markdown['View'] = View;
  markdown['Model'] = Model;

  HiveMind.Markdown = markdown;

  return markdown;

})();
