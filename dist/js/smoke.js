/*! Smoke - v0.1.0 - 2013-05-16
* https://github.com/motherjones/smoke
* Copyright (c) 2013 Mother Jones Tech Team; Licensed MIT */
'use strict';

define([
        'underscore',
        'backbone',
        'dust',
        'nameplate',
        'site_nav',
        'templates'
    ], 
    function(_, Backbone, dust, nameplate, site_nav) {
        var SiteState = Backbone.Model.extend({
            defaults: {
                current_view: new page_view.HomePageView(),
            }
        });

        var SiteView = Backbone.View.extend({
            el: $('body'),

            render: function() {
                var that = this;
                dust.render("site_structure", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el.html(out);
                    }
                    var nameplateView = new nameplate.NameplateView();
                    $('#nameplate', this.el).html( nameplateView.render().el );

                    var navModel = new site_nav.NavModel();  
                    var navView = new site_nav.NavView({
                        model : navModel
                    });
                    $('#site-nav', this.el).html( navView.render().el );

                    this.updateContent();
                });
            },

            updateContent: function() {
                $('#main-content', this.el).html( model.current_view.render().el );
            },

        });

        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
        };
    }
);

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

'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'dust',
        'module',
    ], 
    function(_, $, Backbone, dust, module) {
        var BaseContent = Backbone.Tastypie.Model.extend({
            urlroot: module.config().DATA_STORE + 'basecontent/',
            defaults: {
                content: '',
                title: '',
                link: '',
                layout: '',
                'class': '',
            },
        });

        var BaseContentView = Backbone.View.extend({
            initialize: function() {
            },

            renderer: 'base_content',

            render: function() {
                var that = this;
                dust.render(this.renderer, this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = (out);
                    }
                });
                return this;
            },
        });

        var BaseContentList = Backbone.Tastypie.Collection.extend({
            model: function(attrs, options) {
               //cases here, get more specific content type if wanted
               return new BaseContent(attrs, options);
            },
            urlroot: module.config().DATA_STORE + 'basecontent/',
            defaults: {
                'class': '',
            },
        });

        var BaseContentListView = Backbone.View.extend({
            initialize: function() {
            },
            tagName: 'div',
            modelView: BaseContentView,
            render: function(container) {
                var that = this;
                if (this.title) {
                    this.$el.append('<h4>' + this.title + '</h4>');
                }
                this.$el.append('<ul></ul>');
                this.container = $(container);
                _(this.collection.models).each(function(item) {
                    that.appendItem(item);
                });
                return this;
            },

            appendItem: function(item) {
                var itemView = new this.modelView({
                    model: item
                });
                $('ul', this.el).append(
                    itemView.render().el
                );
            },
        });

        return {
            'BaseContent': BaseContent,
            'BaseContentView' : BaseContentView,
            'BaseContentList': BaseContentList,
            'BaseContentListView' : BaseContentListView,
        };
    }
);

})(define);

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

'use strict';

require([
        'controller',
        'application',
    ], 
    function(controller, application) {
        // start the app instead of fucking around with jquery
        //controller.router.navigate('/article:slug', true);
        var siteState = new application.SiteState();
        var siteView = new application.SiteView({
            model: siteState
        });
        siteView.render();

        siteState.on('change:current_view', siteView.updateContent);

    }
);

'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
    ], 
    function(_, Backbone, dust) {
        var NameplateModel = Backbone.Model.extend({
            defaults: {
                title: 'Mother Jones',
                ad_block: 'An add or something goes here'
            }
        });

        var NameplateView = Backbone.View.extend({
            initialize: function() {
                this.model = new NameplateModel();
            },
            render: function() {
                var that = this;
                dust.render("nameplate", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = out;
                    }
                });
                return this;
            },
        });
        return { 
            'NameplateView': NameplateView,
            'NameplateModel': NameplateModel,
        };

    }
);

})(define);

'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'module',
    ], 
    function(_, Backbone, dust, module) {

        var PageView = Backbone.View.extend({
            page_type_template: 'full_page',
            render : function() {
                var that = this;
                dust.render(page_type_template, this.model.attributes, function(err, out) {
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
            'PageView': PageView,
        };
    }
);

});

'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'content',
        'module',
    ], 
    function(_, Backbone, dust, content, module) {
        var NavModel = Backbone.Model.extend({
            defaults: {
                selected: false,
                nav: 'sections',
                ticker: 'top',
            }
        });

        var NavView = Backbone.View.extend({
            events: {
                'hover nav a': 'swapTicker',
            },
            model: NavModel,
            id: 'site-nav',
            tagName: 'div',
            initialize: function() {
                this.navCollection = new content.BaseContentList({
                    url: module.config().DATA_STORE + '/topnav/' + this.nav,
                });
                this.navView = new content.BaseContentListView({
                    collection: this.navCollection
                });

                this.tickerCollection = new content.BaseContentList({
                    url: module.config().DATA_STORE + '/ticker/' + this.ticker,
                });
                this.tickerView = new content.BaseContentListView({
                    collection: this.tickerCollection
                });
            },

            render: function() {
                var that = this;
                dust.render("site_nav", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = out;
                    }
                });

                $('#nav', this.el).append(
                    this.navView.render().el
                );
                $('#ticker', this.el).append(
                    this.tickerView.render().el
                );

                return this;
            },

        });

        return { 
            'NavView': NavView,
            'NavModel': NavModel,
        };

    }
);

})(define);

(function(){dust.register("article",body_0);function body_0(chk,ctx){return chk.write("<header>").reference(ctx.get("hed"),ctx,"h").write("</header><h4>").reference(ctx.get("dek"),ctx,"h").write("</h4><p>").reference(ctx.get("content"),ctx,"h").write("</p><p>").reference(ctx.get("byline"),ctx,"h").write("</p>");}return body_0;})();
(function(){dust.register("base_content",body_0);function body_0(chk,ctx){return chk.write("<div ").helper("if",ctx,{"block":body_1},{"cond":body_2}).write(">").helper("if",ctx,{"block":body_3},{"cond":body_4}).helper("if",ctx,{"block":body_5},{"cond":body_6}).helper("if",ctx,{"block":body_7},{"cond":body_8}).helper("if",ctx,{"block":body_9},{"cond":body_10}).write("</div>");}function body_1(chk,ctx){return chk.write("class=\"").reference(ctx.get("class"),ctx,"h").write("\"");}function body_2(chk,ctx){return chk.reference(ctx.get("class"),ctx,"h");}function body_3(chk,ctx){return chk.write("<a href=\"").reference(ctx.get("link"),ctx,"h").write("\">");}function body_4(chk,ctx){return chk.reference(ctx.get("link"),ctx,"h");}function body_5(chk,ctx){return chk.write("<h5>").reference(ctx.get("title"),ctx,"h").write("<h5>");}function body_6(chk,ctx){return chk.reference(ctx.get("title"),ctx,"h");}function body_7(chk,ctx){return chk.write("<p>").reference(ctx.get("content"),ctx,"h").write("<p>");}function body_8(chk,ctx){return chk.reference(ctx.get("content"),ctx,"h");}function body_9(chk,ctx){return chk.write("</a>");}function body_10(chk,ctx){return chk.reference(ctx.get("link"),ctx,"h");}return body_0;})();
(function(){dust.register("full_page",body_0);function body_0(chk,ctx){return chk.write("<div class=\"row full_page_content\">").reference(ctx.get("content"),ctx,"h").write("</div>");}return body_0;})();
(function(){dust.register("nameplate",body_0);function body_0(chk,ctx){return chk.write("<a class=\"eight columns\" id=\"site-name\" title=\"Home\" rel=\"home\">Mother Jones</a><div class=\"eight columns\">Ad or subscription or whatever stuff here</div>");}return body_0;})();
(function(){dust.register("site_nav",body_0);function body_0(chk,ctx){return chk.write("<nav id=\"nav\" class=\"row\"></nav><ul id=\"ticker\" class=\"row\"></ul>");}return body_0;})();
(function(){dust.register("site_structure",body_0);function body_0(chk,ctx){return chk.write("<div class=\"container\"><header id=\"main-header\"><div id=\"nameplate\" class=\"row\"></div><div id=\"site-nav\"></div></header><div id=\"main-content\" class=\"row\"><div id=\"full-width\" class=\"sixteen columns one-column-layout mojo-column-layout\">I am within a full width layout</div><div id=\"two-column-left\" class=\"eleven columns two-column-layout mojo-column-layout\">left column in a two column layout</div><div id=\"two-column-right\" class=\"five columns two-column-layout mojo-column-layout\">right column in a two column layout</div><div id=\"three-column-left\" class=\"eight columns three-column-layout mojo-column-layout\">left column ihn a three column layout</div><div id=\"three-column-middle\" class=\"three columns three-column-layout mojo-column-layout\">middle column in a three column layout</div><div id=\"three-column-right\" class=\"five columns three-column-layout mojo-column-layout\">right column in  athre column layout</div></div><footer id=\"main-footer\" class=\"row\"></footer></div>");}return body_0;})();