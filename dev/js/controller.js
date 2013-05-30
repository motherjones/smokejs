/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'article',
        'assets',
        'env_config',
    ], 
    function(_, Backbone, Article, Asset, env_config) {
        var Router = Backbone.Router.extend({
            routes : {
                "article/:slug" : "display_article",
                "asset/:slug" : "display_asset",
            },

            display_article : function(slug) {
                //article = new Article.Article(slug);
                var article = new Article.Article({
                    slug: slug,
                });

                var articleView = new Article.ArticleView({
                    model : article
                });
                articleView.$el.show();
                
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
