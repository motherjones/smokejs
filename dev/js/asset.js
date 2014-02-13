/*global module */
'use strict';
//FIXME make asset views return a subclass depending on if is text or image

module.exports = (function() {
    var $ = require('jquery-browserify');
    var _ = require('underscore');
    var APIObject = require('./api_object');
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var EnvConfig = require('./config');
    //var FileReader = require('./libs/filereader.min');
    

    var AssetModel = APIObject.APIObjectModel.extend({
        urlRoot: EnvConfig.DATA_STORE + 'asset',
        defaults : {
            context: 'main_content',
        },
        blacklist: ['data_url', 'created', 'updated', 'id', 'context',]
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
        set_form: function() {
            this.form = $('form', this.$el);
        },
        post_load: function() {
            var self = this;
            var promise = $.Deferred();
            var context = this.model.get('media_type');
            this.model.set('context', context);
            this.template = this.possible_templates
                [this.model.get('context')];
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
})();
