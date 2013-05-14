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
                current_view: new page_view.HomePageView(),
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

                    this.updateContent();
                });
            },

            updateContent: function() {
                $('#main-content', this.el).html( model.current_view.render().el );
            },

        });

        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
        };
    }
);
