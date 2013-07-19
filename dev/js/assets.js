/*global define */
'use strict';
//FIXME make asset views return a subclass depending on if is text or image

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
            urlRoot: EnvConfig.DATA_STORE + 'asset',
            defaults : {
                context: 'main_content',
                editing: false,
            },
            blacklist: ['data_url', 'created', 'updated', 'id', 'context', 'editing']
        });

        var AssetCollection = Backbone.Collection.extend({
            model: AssetModel,
            //urlroot: util.DATA_STORE + 'asset/',
        });

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
                    edit: 'asset_text.edit',
                },
                image: {
                    view: 'asset_image',
                    edit: 'asset_image.edit',
                },
            },
            process_form: function() {
                var promise = $.Deferred();
                if (this.model.get('context') === 'text') {
                    var text = $('.editable', this.$el).html();
                    this.model.set('data', 'data:plain/text;base64,' +
                            $.base64.encode(text) + '==');
                    promise.resolve();
                } else if (this.model.get('context') === 'image') {
                    var image = $(':file', this.$el)[0].files[0];
                    console.log(image);
                    var reader = new FileReader();
                    reader.onload = (function(theFile,model) {
                        return function(e) {
                            //set model
                            model.set('data', e.target.result + '=');
                            promise.resolve();

                        };
                    })(image,this.model);
                    this.model.set({
                        'media_type': image.type.split('/')[0],
                        'encoding': image.type.split('/')[1]
                    })
                    reader.readAsDataURL(image);
                }
                return promise;
            },
            set_form: function() {
                this.form = $('form', this.$el);
            },
            post_load: function() {
                var self = this;
                var promise = $.Deferred();
                var context = this.model.get('media_type');
                this.model.set('context', context);
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing') ? 'edit' : 'view' ];
                if ( _.contains(this.is_text_type, this.model.get('encoding')) ) {
                    //FIXME probably doesn'/t point to realy data store right now
                    jQuery.get(EnvConfig.MEDIA_STORE + this.model.get('data_url'))
                        .success(function(data) {
                            self.model.set('data', data);
                            promise.resolve();
                        });
                } else {
                    promise.resolve();
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
