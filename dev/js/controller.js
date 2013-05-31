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
            routes : {
                "article/:slug" : "display_main_content",
                "asset/:slug" : "display_asset",
            },

            display_main_content : function(slug) {
                var content = new Content.Content({
                    slug: slug,
                })
                content.fetch()
                .success(function(model, response, options) {
                    var contentView = Content.ContentViewConstructor('main_content', content)
                    $.when(contentView.render()).done(function() {
                        //PUT HTML FROM contentView.el IN PAGE
                        console.log(contentView.el);
                    });
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
            }
        });



        var router = new Router();

        Backbone.history.start();
        return {
            'router': router
        };

    }
);

})(define);
