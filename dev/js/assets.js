/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'backbone_tastypie',
        'dust',
        'env_config',
    ], 
    function(_, Backbone, Tastypie, dust, config) {

        var Asset = Backbone.Model.extend({
            initialize: function() {
                this.urlroot = config.DATA_STORE 
                        + 'asset/' + this.attributes.slug;
            },
            defaults: {
                renderer: 'asset',
            },
        });

        var AssetView = Backbone.View.extend({
            initialize: function() {
            },
            render: function() {
                var that = this;
                dust.render(
                    this.model.renderer,  //name of the template
                    this.model.attributes, //variables to be passed to the template
                    function(err, out) {  //callback
                        if (err.length) {
                            //throw error
                            console.log(err);
                        } else {
                            that.$el = that.el = out;
                        }
                        console.log(that.model.attributes);
                    })
            },
        });

        return {
            Asset: Asset,
            AssetView: AssetView,
        };
    }
);

})(define);
