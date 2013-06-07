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
              spec: 'homepage',
              content_view: null,
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

                });
            },
            updateLayout: function() {
                console.log('re render column layout to be appropriate for the spec : ');
                console.log(this.model.get('spec'));
            },
            updateContent: function() {
               var self = this;
               $.when(self.model.get('content_view').render()).done(function() {
                   $('#main-content', self.el).html( self.model.get('content_view').el );
               });
               //do some logic to show/notshow third/second colums depending on view type
                // do some shit here to properly render third/second column as well
               // 
            },

        });


        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
        };
    }
);
