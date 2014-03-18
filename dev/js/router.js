/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var Article = require('./article');
  var Ad = require('./ad');

  var refreshAds = function(keywords) {
    var groupId = Math.floor(Math.random()*100000000);
    for (var placement in Ad.CurrentAds) {
      var ad = Ad.CurrentAds[placement];
      ad.model.set('key', keywords ? keywords : '');
      ad.model.set('groupid', groupId);
      ad.trigger('pagechange');
    }
  };

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
      var self = this;
      var articleModel = new Article.Model({ id: slug });
      var articleView = new Article.View({ model: articleModel });

      $.when( articleView.load() ).done(function() {
        var template = articleModel.get('template_override') ?
          articleModel.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        $.when(self.siteView.render()).done(function() {
          articleView.attach('#main_content').then(function() {
            refreshAds(articleModel.get('keywords'));
          });
        });
      });
    },

    display_homepage : function() {
      this.siteModel.set('template', 'homepage');
    },

    display_topic : function(slug) {
      var self = this;
      var articleCollection = new Article.Collection({ id: slug });
      var articleCollectionView 
        = new Article.CollectionView({ collection: articleCollection });
      this.siteModel.set('topic', slug);

      $.when( articleCollection.load() ).done(function() {

        var template = articleCollection.get('template_override') ?
          articleCollection.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        refreshAds(articleCollection.get('keywords'));

        $.when(self.siteView.render()).done(function() {
          articleCollectionView.attach('#main_content');
        });

      });
    },

  });

})();
