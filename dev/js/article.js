/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'module',
    ], 
    function(_, Backbone, dust, module) {
        var Article = Backbone.Tastypie.Model.extend({
            defaults : {
                slug: 'fakeslug',
                hed: 'headline',
                dek: 'dek',
                content: ['hellooo above the fold', ' anyone home below the fold', 'other pages'],
                byline: 'by nobody ever',
            },
            urlroot : module.config().DATA_STORE + 'article/',
        });

        var Articles = Backbone.Tastypie.Collection.extend({
            model: Article,
            urlroot : module.config().DATA_STORE + 'article/',
        });


        var ArticleView = Backbone.View.extend({
            tagName : 'article',
            className : 'article',
            render : function() {
                var that = this;
                dust.render("article", this.model.attributes, function(err, out) {
                    if (err) {
                        console.log(err);
                        // throw error here
                    } else {
                        that.$el = that.el = out;
                    }
                });
                return this;
            }
        });


        return {
            Article: Article,
            Articles: Articles,
            ArticleList: ArticleList,
            ArticleView: ArticleView,
        };
    }
);

})(define);
