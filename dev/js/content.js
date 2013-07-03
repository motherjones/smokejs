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
        'jquery',
        'underscore',
        'backbone',
        'api_object',
        'assets',
        'env_config',
    ], 
    function($, _, Backbone, APIObject, Asset, EnvConfig) {

        var ContentModel = APIObject.APIObjectModel.extend({
            urlRoot: EnvConfig.DATA_STORE + 'content',
            defaults : {
                context: 'main',
                editing: false,
            },
        });

        //this.asset_collection = new Assets.AssetCollection().add(this.assets);

        var spec_to_templates = {
            article : {
                main : {
                    view: 'main_article',
                    edit: 'main_article.edit',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'sidebar_content.edit',
                },
                list :  {
                    view: 'list_content',
                    edit: 'list_content.edit',
                },
            },
            photoessay : {
                main : {
                    view: 'main_photoessay',
                    edit: 'main_photoessay.edit',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'sidebar_content.edit',
                },
                list :  {
                    view: 'list_content',
                    edit: 'list_content.edit',
                },
            },
            blog : {
                main : {
                    view: 'main_blog',
                    edit: 'main_blog.edit',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'sidebar_content.edit',
                },
                list :  {
                    view: 'list_content',
                    edit: 'list_content.edit',
                },
            },
        };

        var ContentView = APIObject.APIObjectView.extend({
            contexts_which_require_assets_loaded: [
                'main_content',
            ],
            child_assets_editing: function(editing) { 
                for (var attribute in this.attribute_views) {
                    var attributeView = this.attribute_views[attribute];
                    attributeView.model.set('editing', editing);
                }
                for (var i = 0; i < this.member_views.length; i++) {
                    this.member_views[i].model.set('editing', editing);
                }
            },
            member_views : [],
            attribute_views: {},
            post_load: function() {
                this.possible_templates = spec_to_templates[
                    this.model.get('spec')
                ];
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing') ? 'edit' : 'view' ];
                var content_attributes = this.model.get('attributes');
                for ( var attribute in content_attributes) {
                    var attributeView = this.create_asset_view(
                        content_attributes[attribute].attribute
                    );
                    this.attribute_views[attribute] = attributeView;
                }

                var content_members = this.model.get('members') || [];
                for ( var i = 0; i < content_members.length; i++) {
                    this.member_views.push(
                        this.create_asset_view(content_members[i].member)
                    );
                }
            },
            process_form: function() {
                console.log('fixme, serialize and return form vals');
                return;
            },
            set_form: function() {
                this.form = $('form', this.$el);
            },
            create_asset_view: function(asset_data) {
               //FIXME ask real nice if we cna not have resource uri on here
               if (asset_data.resource_uri) {
                   delete asset_data.resource_uri;
               }
                var assetModel = new Asset.AssetModel( asset_data );
                var assetView = new Asset.AssetView({ model: assetModel });
                if ( _.contains(
                        this.contexts_which_require_assets_loaded,
                        this.model.get('context')
                    ) 
                ) {
                    assetView.load();
                }
                return assetView;
            },
        });

//FIXME THIS IS ASS NEED GOOD LIST HANDLING
        var ContentListModel = Backbone.Collection.extend({
            model: ContentModel,
        });


        var ContentListView = Backbone.View.extend({
            //FIXME this is awful
            //render: function(container) {
                //var that = this;
                //this.collection.each(function() {
                    //make model, put in view, render, append to that.$el
                //})
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
                return this;
            },
                */

        });

        return {
            'ContentModel': ContentModel,
            'ContentView' : ContentView,
            'ContentListModel' : ContentListModel,
            'ContentListView' : ContentListView,
        };
    }
);

})(define);
