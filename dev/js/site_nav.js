/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'backbone',
        'dust',
        'content',
        'env_config',
    ], 
    function(_, Backbone, dust, content, env_config) {
        var NavModel = Backbone.Model.extend({
            defaults: {
                selected: false,
                nav: 'sections',
                ticker: 'top',
            }
        });

        var NavView = Backbone.View.extend({
            events: {
                'hover nav a': 'swapTicker',
            },
            model: NavModel,
            id: 'site-nav',
            tagName: 'div',
            initialize: function() {
                /*
                this.navCollection = new content.ContentListModel({
                    url: env_config.DATA_STORE + '/topnav/' + this.nav,
                });
                this.navView = new content.ContentListView(this.navCollection);

                this.tickerCollection = new content.ContentList({
                    url: env_config.DATA_STORE + '/ticker/' + this.ticker,
                });
                this.tickerView = new content.ContentListViewConstructor('ticker', this.tickerCollection)
                */
            },

            render: function() {
                        return;
                        /*
                var that = this;
                dust.render("site_nav", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        env_config.ERROR_HANDLER(err);
                    } else {
                        that.$el = that.el = out;
                    }
                });

                $('#nav', this.el).append(
                    this.navView.render().el
                );
                $('#ticker', this.el).append(
                    this.tickerView.render().el
                );

                return this;
                */
            },

        });

        return { 
            'NavView': NavView,
            'NavModel': NavModel,
        };

    }
);

})(define);
