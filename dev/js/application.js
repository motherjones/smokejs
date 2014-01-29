/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var dust = require('./dust_templates.js')();
    var Nameplate = require('./nameplate');


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
                var nameplateView = new Nameplate.NameplateView();
                $('#nameplate', this.el).html( nameplateView.render().el );

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
            );
        },
        updateContent: function() {
           var self = this;
           $.when(self.model.get('content_view').render()).done(function() {
               $('#main-content', self.el).append( 
                   self.model.get('content_view').$el 
               );
           });
           //do some logic to show/notshow third/second colums depending on view type
            // do some shit here to properly render third/second column as well
           // 
        },

    });

    var auth = function(role) {
        //FIXME do some auth here
        if (role) {
            return true;
        }
    };

    return {
        'SiteView': SiteView,
        'SiteState': SiteState,
        'auth' : auth,
    };
})();
