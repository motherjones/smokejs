/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'article',
        'assets',
    ], 
    function(_, Backbone, Article, Asset) {
        var Router = Backbone.Router.extend({
            routes : {
                "article/:slug" : "display_article",
                "asset/:slug" : "display_asset",
            },

            display_article : function(slug) {
                //article = new Article.Article(slug);
                var fakeArticle = new Article.Article({
                    slug: slug,
                });

                var fakeArticleView = new Article.ArticleView({
                    model : fakeArticle
                });
                fakeArticleView.$el.show();
                
            },

            display_asset : function(slug) {
                var fakeAssetModel = new Asset.Asset({
                    'slug': slug,
                });

                var fakeAssetView = new Asset.AssetView({
                    model: fakeAssetModel
                });

                fakeAssetView.render();
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
