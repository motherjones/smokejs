/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
    ], 
    function(_, Backbone, dust) {
        var NameplateModel = Backbone.Model.extend({
            defaults: {
                title: 'Mother Jones',
                ad_block: 'An add or something goes here'
            }
        });

        var NameplateView = Backbone.View.extend({
            initialize: function() {
                this.model = new NameplateModel();
            },
            render: function() {
                var that = this;
                dust.render("nameplate", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = out;
                    }
                });
                return this;
            },
        });
        return { 
            'NameplateView': NameplateView,
            'NameplateModel': NameplateModel,
        };

    }
);

})(define);
