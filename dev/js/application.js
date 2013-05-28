/*global define */
'use strict';

define([
        'underscore',
        'backbone',
        'dust',
        'nameplate',
        'site_nav',
        'page',
        'templates'
    ], 
    function(_, Backbone, dust, nameplate, site_nav, page) {
        var SiteState = Backbone.Model.extend({
            defaults: {
            }
        });

        var SiteView = Backbone.View.extend({
            el: $('body'),

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

                    that.updateContent();
                });
            },

            updateContent: function() {
               var that = this;
               $('#main-content', this.el).html( that.model.currentView.render().el );
            },

        });

        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
        };
    }
);
