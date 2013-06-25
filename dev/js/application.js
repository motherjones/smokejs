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
              spec: 'homepage',
              content_view: null,
            }
        });

        var SiteView = Backbone.View.extend({
            el: $('body'),

            spec_to_column_layout: {
                article: 'two_column_layout',
                page: 'single_column_layout',
                homepage: 'three_column_layout',
            },

            render: function() {
                var self = this;
                dust.render("site_structure", this.model.attributes, function(err, out) {
                    if (err) {
                        //throw error
                        console.log(err);
                    } else {
                        self.$el.html(out);
                    }
                    var nameplateView = new nameplate.NameplateView();
                    $('#nameplate', this.el).html( nameplateView.render().el );

                    var navModel = new site_nav.NavModel();  
                    var navView = new site_nav.NavView({
                        model : navModel
                    });
                    //$('#site-nav', this.el).html( navView.render().el );

                    self.updateLayout();
                });
            },
            updateLayout: function() {
                var self = this;
                dust.render(
                    self.spec_to_column_layout[self.model.get('spec')],
                    this.model.attributes,
                    function(err, out) {
                        if (err) {
                            //throw error
                            console.log(err);
                        } else {
                            $('#content', self.el).html( out );
                        }
                    }
                )
            },
            updateContent: function() {
               var self = this;
               $.when(self.model.get('content_view').render()).done(function() {
                   $('#main-content', self.el).html( 
                       self.model.get('content_view').el 
                   );
               });
               //do some logic to show/notshow third/second colums depending on view type
                // do some shit here to properly render third/second column as well
               // 
            },

        });

        var auth = function(role) {
            //FIXME do some auth here
            return true;
        }

        return {
            'SiteView': SiteView,
            'SiteState': SiteState,
            'auth' : auth,
        };
    }
);
