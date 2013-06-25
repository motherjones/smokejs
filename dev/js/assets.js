/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'jquery',
        'api_object',
        'env_config',
    ], 
    function(_, Backbone, $, APIObject, EnvConfig) {
        
        var AssetModel = APIObject.APIObjectModel.extend({
            object_type: 'asset',
            defaults : {
                context: 'main_content',
                editing: false,
            },
        });

        var AssetCollection = Backbone.Collection.extend({
            model: AssetModel,
            //urlroot: util.DATA_STORE + 'asset/',
        })

        var AssetView = APIObject.APIObjectView.extend({
            is_text_type : [
                'text',
                'html',
                'md',
            ],
            requires_content_load : [
                'text',
                'html',
                'md',
            ],
            possible_templates: {
                text: {
                    view: 'asset_text',
                    edit: 'asset_text_edit',
                },
                image: {
                    view: 'asset_image',
                    edit: 'asset_image_edit',
                },
            },
            post_load: function() {
                var self = this;
                var promise = $.Deferred();
                var context = _.contains(
                    this.is_text_type,
                    this.model.get('encoding')
                )
                    ? 'text'
                    : 'image'
                ;
                this.model.set('context', context);
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing') ? 'edit' : 'view' ];
                if ( _.contains(this.is_text_type, this.model.get('encoding')) ) {
                    //FIXME probably doesn'/t point to realy data store right now
                    console.log(this.model.get('data_url'));
                    jQuery.get(EnvConfig.MEDIA_STORE + this.model.get('data_url'))
                        .success(function(data) {
                            self.model.set('content', data);
                            console.log(data);
                            promise.resolve()
                        });
                } else {
                    promise.resolve()
                }
                return promise;

            },
        });

        return {
            AssetModel: AssetModel,
            AssetView: AssetView,
            AssetCollection: AssetCollection,
        };
    }
);

})(define);
