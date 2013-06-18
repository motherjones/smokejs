/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'jquery',
        'env_config',
        'util',
    ], 
    function(_, Backbone, $, env_config, util) {

        var Asset = Backbone.Model.extend({

            initialize: function() {
                this.url = util.DATA_STORE 
                        + 'asset/' + this.get('slug');
            },
        });

        var AssetCollection = Backbone.Collection.extend({
            model: Asset,
            urlroot: util.DATA_STORE + 'asset/',
        })

        var AssetView = Backbone.View.extend({
            requires_external_content : [
                'text',
                'html',
                'md',
            ],
            render: function() {
                var self = this;

                if (!this.template) {
                    this.template = _.contains(
                            this.requires_external_content,
                            this.model.get('encoding')
                    )
                        ? 'asset_text'
                        : 'asset_image'
                    ;
                }

                if ( _.contains(this.requires_external_content, this.model.get('encoding')) ) {
                    var promise = $.Deferred();

                    jQuery.ajax({
                        url: env_config.MEDIA_STORE + this.model.get('data'),
                        success: function(data) {
                            self.model.set('content', data);
                            $.when(
                                util.render(self)
                            ).done(function() {
                                promise.resolve();
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            env_config.ERROR_HANDLER('Failed to load external content: ' + err);
                            promise.resolve();
                        }
                    });

                    return promise;

                } else {
                    return util.render(this); //this returns a promise that on completion, the view.el will have the rendered bit
                }
            },
        });

        return {
            Asset: Asset,
            AssetView: AssetView,
            AssetCollection: AssetCollection,
        };
    }
);

})(define);
