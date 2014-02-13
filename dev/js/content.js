/*global module */
/* okay
 * so a content is a collection of assets with extra stuff
 * so in the content model creation, we create an asset collection,
 * and stick it in the content model.
 * yeah rendering will be a little strange, but whatever
 */
'use strict';

module.exports = (function() {
    var _ = require('underscore');
    var APIObject = require('./api_object');
    var Asset = require('./asset');
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var EnvConfig = require('./config');


    var ContentModel = APIObject.APIObjectModel.extend({
        urlRoot: EnvConfig.DATA_STORE + 'content',
        defaults : {
            context: 'main',
        },
    });

    //this.asset_collection = new Assets.AssetCollection().add(this.assets);

    var spec_to_templates = {
        article : {
            main : {
                view: 'main_article',
            },
            sidebar : {
                view: 'sidebar_content',
            },
            list :  {
                view: 'list_content',
            },
        },
        photoessay : {
            main : {
                view: 'main_photoessay',
            },
            sidebar : {
                view: 'sidebar_content',
            },
            list :  {
                view: 'list_content',
            },
        },
        blog : {
            main : {
                view: 'main_blog',
            },
            sidebar : {
                view: 'sidebar_content',
            },
            list :  {
                view: 'list_content',
            },
        },
    };

    var ContentView = APIObject.APIObjectView.extend({
        contexts_which_require_assets_loaded: [
            'main_content',
        ],
        member_views : [],
        attribute_views: {},
        post_load: function() {
            this.possible_templates = spec_to_templates[
                this.model.get('spec')
            ];
            this.template = this.possible_templates
                [this.model.get('context')];
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

})();
