/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'jquery',
        'util',
    ], 
    function(_, Backbone, $, util) {

        var Asset = Backbone.Model.extend({

            initialize: function() {
                this.url = util.DATA_STORE 
                        + 'asset/' + this.attributes.slug;
            },
        });

        var AssetCollection = Backbone.Collection.extend({
            model: Asset,
            urlroot: util.DATA_STORE + 'asset/',
        })

        var AssetView = Backbone.View.extend({
            initialize: function() {
            },
            template: 'asset',
            render: function() {
                return util.render(this); //this returns a promise that on completion, the view.el will have the rendered bit
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
