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
        'api_object',
        'assets',
    ], 
    function($, APIObject, Asset) {

        var ContentModel = APIObject.APIObjectModel.extend({
            object_type: 'content',
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
                    edit: 'edit_main_article',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'edit_sidebar_content',
                },
                list :  {
                    view: 'list_content',
                    edit: 'edit_list_content',
                },
            },
            photoessay : {
                main : {
                    view: 'main_photoessay',
                    edit: 'edit_main_photoessay',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'edit_sidebar_content',
                },
                list :  {
                    view: 'list_content',
                    edit: 'edit_list_content',
                },
            },
            blog : {
                main : {
                    view: 'main_blog',
                    edit: 'edit_main_blog',
                },
                sidebar : {
                    view: 'sidebar_content',
                    edit: 'edit_sidebar_content',
                },
                list :  {
                    view: 'list_content',
                    edit: 'edit_list_content',
                },
            },
        };

        var ContentView = APIObject.APIObjectView.extend({
            contexts_which_require_assets_loaded: [
                'main_content',
            ],
            post_load: function() {
                this.possible_templates = spec_to_templates[this.model.get('spec')]
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing') ? 'edit' : 'view' ];
                var content_attributes = this.model.get('attributes');
                for ( var attribute in content_attributes) {
                    var attributeView = this.create_asset_view(
                        content_attributes[attribute]
                    );
                    this.model.set(attribute, attributeView);
                }

                var content_members = this.model.get('members');
                var member_views = [];
                for ( var i = 0; i < content_members.length; i++) {
                    member_views.push(
                        this.create_asset_view(content_members[i].member)
                    );
                }
                this.model.set('member_views', member_views);
            },
            create_asset_view: function(asset_data) {
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
            'ContentModel': ContentModel,
            'ContentView' : ContentView,
            'ContentListModel' : ContentListModel,
            'ContentListView' : ContentListView,
        };
    }
);

})(define);
