/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    var $ = require('jquery');
    var Article = require('./article');

    return Backbone.Router.extend({
        routes : {
            "/" : "display_homepage",
            "article/:slug" : "display_main_content",
            "/topic/:slug" : "display_topic",
            "/:slug" : "display_section",
        },

        display_main_content : function(slug) {
          var articleModel = new Article.Model({ id: slug });
          var articleView = new Article.View({ model: articleModel });
          $.when( articleView.load() ).done(function() {
              this.siteModel.set('template',
                  articleModel.get('template')
              );
          });
        },

        display_homepage : function() {
            this.site_state.model.set('template', 'homepage');
        },

        display_topic : function(slug) {
            this.site_state.model.set('topic', slug);
            this.site_state.model.set('template', 'topic');
        },

        display_section : function(slug) {
            this.site_state.model.set('section', slug);
            this.site_state.model.set('template', 'section');
        },

    });

})();
