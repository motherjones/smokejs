/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var HiveMind = require('./hivemind');
  var Ad = require('./ad');
  require('./article'); // must load up all media types at some point, probably not here

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
        "topic/:slug" : "display_topic",
        "section/:slug" : "display_section",
        ":schema/:slug" : "display_main_content",
        "" : "display_homepage",
    },

    display_main_content : function(schema, slug) {
      var self = this;
      var asset = HiveMind.possibleAssets[schema];
      var model = new asset.Model({ id: slug });
      var view = new asset.View({ model: model });

      $.when( view.load() ).done(function() {
        var template = model.get('template_override') ?
          model.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        $.when(self.siteView.attach('body')).done(function() {
          view.attach('#main_content').done(function() {
            refreshAds(model.get('keywords'));
          });
        });
      });
    },

    display_homepage : function() {
      this.siteModel.set('template', 'homepage');
    },

    display_topic : function(slug) {
      this.display_collection(slug, 'topic');
    },
    display_section : function(slug) {
      this.display_collection(slug, 'section');
    },
    display_collection : function(slug, template) {
      var self = this;
      var collection = new HiveMind.Collection({ id: slug });
      collection.set('template', template);
      var collectionView 
        = new HiveMind.CollectionView({ collection: collection });
      this.siteModel.set('topic', slug);

      $.when( collection.load() ).done(function() {

        var template = collection.get('template_override') ?
          collection.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        refreshAds(collection.get('keywords'));

        $.when(self.siteView.render()).done(function() {
          collectionView.attach('#main_content');
        });

      });
    },

  });

})();
