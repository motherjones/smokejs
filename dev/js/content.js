/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'dust',
        'module',
    ], 
    function(_, $, Backbone, dust, module) {
        var BaseContent = Backbone.Tastypie.Model.extend({
            urlroot: module.config().DATA_STORE + 'basecontent/',
            defaults: {
                content: '',
                title: '',
                link: '',
                layout: '',
                'class': '',
            },
        });

        var BaseContentView = Backbone.View.extend({
            initialize: function() {
            },

            renderer: 'base_content',

            render: function() {
                var that = this;
                dust.render(this.renderer, this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el = that.el = (out);
                    }
                });
                return this;
            },
        });

        var BaseContentList = Backbone.Tastypie.Collection.extend({
            model: function(attrs, options) {
               //cases here, get more specific content type if wanted
               return new BaseContent(attrs, options);
            },
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
