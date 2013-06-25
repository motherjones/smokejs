/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'content',
        'assets',
        'env_config',
    ], 
    function(_, Backbone, Content, Asset, env_config) {
        var Router = Backbone.Router.extend({

            initialize: function(options) {
                this.site_state = options.site_state;
            },

            routes : {
                "article/:slug" : "display_main_content",
                "asset/:slug" : "display_asset",
                //FIXME move edit elsewhere
                "edit/:slug" : "edit_content",
            },

            display_main_content : function(slug) {
                var self = this;
                var content = new Content.ContentModel({
                    resource_uri : '/api/v1/content/' + slug,
                })
                var content_view = new Content.ContentView({ model: content });
                self.site_state.set({
                    content_view : content_view,
                });
            },

            display_asset : function(slug) {
                var that = this;
                var assetModel = new Asset.Asset({
                    'slug': slug,
                })

                var assetView = new Asset.AssetView({
                    model: assetModel
                });

                assetView.render();
            },
            //FIXME move edit elsewhere
            edit_content : function(slug) {
                var self = this;
                var content = new Content.Content({
                    slug: slug,
                })
                content.fetch()
                .success(function(model, response, options) {
                    self.site_state.set({spec : 'page'});
                    self.site_state.set({
                        content_view : Content.ContentViewConstructor('edit_content', content)
                    });
                });
            },

        });



        return {
            'Router': Router
        };

    }
);

})(define);
