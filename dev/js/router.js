/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    var $ = require('jquery');

    return Backbone.Router.extend({
        routes : {
            "/" : "display_homepage",
            "article/:slug" : "display_main_content",
            "/topic/:slug" : "display_topic",
            "/:slug" : "display_section",
        },

        display_main_content : function(slug) {
            this.main_content.model.set('id', slug);
            $.when( this.main_content.loaded ).done(function() {
                this.site_state.model.set('template',
                    this.main_content.model.get('template')
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
