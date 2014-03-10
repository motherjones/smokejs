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
        "/" : "display_homepage",
        "/article/:slug" : "display_main_content",
        "/topic/:slug" : "display_topic",
        "/section/:slug" : "display_topic",
        "/:slug" : "display_section",
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
          articleView.attach('#main_content');
        });

      });
    },

    display_homepage : function() {
      this.site_state.model.set('template', 'homepage');
    },

    display_topic : function(slug) {
      var self = this;
      var articleCollection = new Article.Collection({ id: slug });
      this.site_state.model.set('topic', slug);

      $.when( articleCollection.load() ).done(function() {

        var template = articleCollection.get('template_override') ?
          articleCollection.get('template_override') :
          'two_column_layout';
        self.siteModel.set('template', template);

        $.when(self.siteView.render()).done(function() {
          articleCollection.attach('#main_content');
        });

      });
    },

  });

})();
