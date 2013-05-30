/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'env_config',
        'jquery',
    ], 
    function(_, Backbone, dust, env_config, $) {

        var Asset = Backbone.Model.extend({

            initialize: function() {
                this.url = env_config.DATA_STORE 
                        + 'asset/' + this.attributes.slug;
            },
            defaults: {
                renderer: 'asset',
            },
        });

        var AssetCollection = Backbone.Collection.extend({
            model: Asset,
            urlroot: env_config.DATA_STORE + 'asset/',
        })

        var AssetView = Backbone.View.extend({
            initialize: function() {
            },
            render: function() {
                var that = this;
                dust.render(
                    this.model.attributes.renderer,  //name of the template
                    this.model.attributes, //variables to be passed to the template
                    function(err, out) {  //callback
                        if (err) {
                            //throw error
                            env_config.ERROR_HANDLER(err);
                        } else {
                            that.$el = that.el = out;
                        }
                    }
                );
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
