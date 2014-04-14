/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var HiveMind = require('./hivemind');
  var Ad = require('./ad');
  require('./article'); // must load up all media types at some point, probably not here
  require('./splashpage');
  var Author = require('./author');

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
        "section/:slug": "display_section",
        "author/:slug": "display_author",
        ":schema/:slug" : "display_main_content",
        "" : "display_homepage",
    },

    display_main_content : function(schema, slug) {
      var asset = HiveMind.possibleAssets[schema];
      var model = new asset.Model({ id: slug });
      var view = new asset.View({ model: model });

      $.when( view.load() ).done(function() {
        view.attach('body').done(function() {
          refreshAds(model.get('keywords'));
        });
      });
    },

    display_homepage : function() {
      var slug = '1'; //FIXME get a better way of getting the homepage slug here
      var model = new HiveMind.possibleAssets['splashpage']
          .Model({ id: slug });
      var view = new HiveMind.possibleAssets['splashpage']
          .View({model: model});
      view.load().done(function() {
        view.attach('body').done(function() {
            refreshAds(model.get('keywords'));
        });
      });
    },
    
    display_author: function(slug) {
      var model = new Author.Model({slug: slug});
      var view = new Author.View({model: model});
      view.load().done(function() {
          $.when(view.attach('body')).done(function() { 
            refreshAds(model.get('keywords'));
          });
      });
    },

    display_topic : function(slug) {
      this.display_collection(slug, 'topic');
    },
    display_section : function(slug) {
      this.display_collection(slug, 'section');
    },
    display_collection : function(slug, template) {
      var collection = new HiveMind.Collection({ id: slug });
      collection.template = template;
      var collectionView 
        = new HiveMind.CollectionView({ collection: collection });

      $.when( collectionView.attach('body') ).done(function() {
        refreshAds(collection.get('keywords'));
      });
    },

  });

})();
