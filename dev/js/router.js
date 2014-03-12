/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var Article = require('./article');

  return Backbone.Router.extend({
    initialize: function(options) {
      for (var i in options) {
        this[i] = options[i];
      }
    },

    routes : {
        "article/:slug" : "display_main_content",
        "topic/:slug" : "display_topic",
        "section/:slug" : "display_topic",
        "" : "display_homepage",
    },

    display_main_content : function(slug) {
       console.log('display main');
      var self = this;
      var articleModel = new Article.Model({ id: slug });
      var articleView = new Article.View({ model: articleModel });

      $.when( articleView.load() ).done(function() {
        var template = articleModel.get('template_override') ?
          articleModel.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        $.when(self.siteView.render()).done(function() {
          articleView.attach('#main_content');
        });

      });
    },

    display_homepage : function() {
      console.log('homepage');
      this.siteModel.set('template', 'homepage');
    },

    display_topic : function(slug) {
      var self = this;
      console.log('in topic');
      var articleCollection = new Article.Collection({ id: slug });
      console.log('about to break making article collection view');
      var articleCollectionView 
        = new Article.CollectionView({ collection: articleCollection });
      console.log('article collection view created');
      this.siteModel.set('topic', slug);

      $.when( articleCollection.load() ).done(function() {
        console.log('collection loaded');

        var template = articleCollection.get('template_override') ?
          articleCollection.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        $.when(self.siteView.render()).done(function() {
          articleCollectionView.attach('#main_content');
        });

      });
    },

  });

})();
