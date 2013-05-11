/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'article',
    ], 
    function(_, Backbone, Article) {
        var Router = Backbone.Router.extend({
            routes : {
                "article:slug" : "display_article",
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
