/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'module',
    ], 
    function(_, Backbone, dust, module) {

        var PageView = Backbone.View.extend({
            page_type_template: 'full_page',
            render : function() {
                var that = this;
                dust.render(page_type_template, this.model.attributes, function(err, out) {
                    if (err) {
                        console.log(err);
                        // throw error here
                    } else {
                        that.$el = that.el = out;
                    }
                });
                return this;
            }
        });

        return {
            'PageView': PageView,
        };
    }
);

});
