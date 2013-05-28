/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'backbone_tastypie',
        'dust',
        'module',
    ], 
    function(_, $, Backbone, Tastypie, dust, module) {
        var BaseContent = Backbone.Model.extend({
            urlroot: module.config().DATA_STORE + 'content/',
            defaults: {
                content: '',
                title: '',
                link: '',
                layout: '',
                'class': '',
                renderer: 'base_content',
            },
        });

        var BaseContentView = Backbone.View.extend({
            initialize: function() {
            },

            render: function() {
                var that = this;
                dust.render(this.model.renderer, this.model.attributes, function(err, out) {
                    if (err.length) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = (out);
                    }
                });
                return this;
            },
        });

        var BaseContentList = Backbone.Collection.extend({
            urlroot: module.config().DATA_STORE + 'basecontent/',
            defaults: {
                'class': '',
            },
        });

        var BaseContentListView = Backbone.View.extend({
            initialize: function() {
            },
            tagName: 'div',
            modelView: BaseContentView,
            render: function(container) {
                var that = this;
                if (this.title) {
                    this.$el.append('<h4>' + this.title + '</h4>');
                }
                this.$el.append('<ul></ul>');
                this.container = $(container);
                _(this.collection.models).each(function(item) {
                    that.appendItem(item);
                });
                return this;
            },

            appendItem: function(item) {
                var itemView = new this.modelView({
                    model: item
                });
                $('ul', this.el).append(
                    itemView.render().el
                );
            },
        });

        return {
            'BaseContent': BaseContent,
            'BaseContentView' : BaseContentView,
            'BaseContentList': BaseContentList,
            'BaseContentListView' : BaseContentListView,
        };
    }
);

})(define);
