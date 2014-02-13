/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var Content = require('./content');
    var dust = require('../../build/js/dust_templates.js')();
    var Env_config = require('./config');


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
            this.navCollection = new Content.ContentListModel({
                url: Env_config.DATA_STORE + '/topnav/' + this.nav,
            });
            this.navView = new Content.ContentListView(this.navCollection);

            /*
            this.tickerCollection = new Content.ContentList({
                url: Env_config.DATA_STORE + '/ticker/' + this.ticker,
            });
            this.tickerView = new Content.ContentListViewConstructor('ticker', this.tickerCollection)
            */
        },

        render: function() {
            var that = this;
            dust.render("site_nav", this.model.attributes, function(err, out) {
                if (err) {
                    //throw error
                    Env_config.ERROR_HANDLER(err);
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
        },

    });

    return { 
        'NavView': NavView,
        'NavModel': NavModel,
    };

})();
