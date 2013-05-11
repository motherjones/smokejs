/*global define */
'use strict';

define([
        'underscore',
        'backbone',
        'dust',
        'nameplate',
        'site_nav',
        'templates'
    ], 
    function(_, Backbone, dust, nameplate, site_nav) {
        var SiteState = Backbone.Model.extend({
            defaults: {
                display_ticker: true,
                display_third_column: true,
                display_second_column: true,
            }
        });

        var SiteView = Backbone.View.extend({
            el: $('body'),
            initialize: function(attrs, options) {
                this.model = new SiteState(attrs, options);
            },

            render: function() {
                var that = this;
                dust.render("site_structure", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        that.$el.html(out);
                    }
                    var nameplateView = new nameplate.NameplateView();
                    $('#nameplate', this.el).html( nameplateView.render().el );

                    var navModel = new site_nav.NavModel();  
                    var navView = new site_nav.NavView({
                        model : navModel
                    });
                    $('#site-nav', this.el).html( navView.render().el );
                });
            },
        });
        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
        };
    }
);
