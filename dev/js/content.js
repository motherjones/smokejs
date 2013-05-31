/*global define */
/* okay
 * so a content is a collection of assets with extra stuff
 * so in the content model creation, we create an asset collection,
 * and stick it in the content model.
 * yeah rendering will be a little strange, but whatever
 */
'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'backbone_tastypie',
        'assets',
        'util',
    ], 
    function(_, $, Backbone, Tastypie, Assets, util) {

        var Content = Backbone.Model.extend({
            initialize: function() {
                this.url = util.DATA_STORE 
                        + 'content/' + this.attributes.slug;
                //this.asset_collection = new Assets.AssetCollection().add(this.assets);
            },
        });

        var ContentViewConstructor = function(view_context, model) {
            switch (view_context)
            {
                case 'main_content':
                    return new MainContentView({
                        model: model
                    });
                case 'right_sidebar':
                    return new SidebarContentView({
                        model: model
                    });
                //more here as we identify other contexts for content
            };
        }

        var BaseContentView = Backbone.View.extend({
            initialize: function() {
                this.template = this.content_type_to_templates[this.model.attributes.spec];
            },

            render: function() {
                return util.render(this); //this returns a promise that on completion, the view.el will have the rendered bit
            },
        });

        var MainContentView = BaseContentView.extend({
            content_type_to_templates : {
                article : 'main_content_article',
                photoessay : 'main_content_photoessay',
                page :  'main_content_page',
                //more here as we get differetn content types that go on the main page
            },
        })

        var SidebarContentView = BaseContentView.extend({
            content_type_to_templates : {
                article : 'sidebar_content_hed_dek_master',
                photoessay : 'sidebar_content_hed_dek_master',
                page :  'sidebar_content_snippet',
                //more here as we get differetn content types that go in the sidebar
            },
        })

//FIXME THIS IS ASS NEED GOOD LIST HANDLING
        var ContentList = Backbone.Collection.extend({
            model: Content,
        });


        var ContentListViewConstructor = function(view_context, collection) {
            //FISXME make this return as appropriate, not this
            return new ContentListView({ collection: collection });
            //do things here when I have stuff
            switch (view_context)
            {
                //more here as we identify other contexts for content
            };
        }

        var ContentListView = Backbone.View.extend({
            render: function(container) {
                var that = this;
                this.collection.each(function() {
                    //make model, put in view, render, append to that.$el
                })
                /*
                dust.render(
                    'content_list',
                    this.model.attributes,
                    function(err, out) {
                        if (err) {
                            utiutilERROR_HANDLER(err);
                        } else {
                            that.$el = that.el = (out);

                        }
                    }
                );
                */
                return this;
            },

        });

        return {
            'Content': Content,
            'ContentViewConstructor' : ContentViewConstructor,
            'ContentList': ContentList,
            'ContentListViewConstructor' : ContentListViewConstructor,
        };
    }
);

})(define);
