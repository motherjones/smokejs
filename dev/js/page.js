/*global define */
'use strict';


define([
        'underscore',
        'backbone',
        'dust',
        'env_config',
    ], 
    function(_, Backbone, dust, env_config) {

        var PageModel = Backbone.Model.extend({
            defaults: {
                renderer: 'full_page',
            }
        });
        //refactor this, make this three view? one for each column type layout
        var PageView = Backbone.View.extend({
            initialize: function() {
                this.listenTo(this.model, "change", this.render);
            },

            render : function() {
                var that = this;
                dust.render(this.model.renderer, this.model.attributes, function(err, out) {
                    if (err.length) {
                        env_config.ERROR_HANDLER(err);
                        // throw error here
                    } else {
                        that.$el = that.el = out;
                    }
                });
                return this;
            }
        });

        return {
            'PageView': PageView,
            'PageModel': PageModel,
        };
    }
);

