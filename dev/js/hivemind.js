/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    var $ = Backbone.$ = require('jquery-browserify');
    var Dust = require('../../build/js/dust_templates.js')();
    var Env_config = require('./config');


    var Model = new Backbone.Model.extend({
        urlRoot: EnvConfig.DATA_STORE + 'content',
    });

    var Collection = new Backbone.Model.extend({
    });

    var View = Backbone.View.extend({
        model_type: Model,
        self: this,

        before_render: function(){},
        after_render: function(){},

        attach: function(selector) {
            this.$el = $(selector);
            this.render();
        },

        initialize: function() {
            this.listenTo(this.model.id, 'change', function() {
                this.loaded = null;
                this.load();
            });
            this.listenTo(this.model, 'change', this.render);
        },

        when: function(promises) {
            return $.when.apply(null, promises);
        },

        dustbase: Dust.makeBase({
            media_base : Env_config.MEDIA_STORE,
            load_asset:  function(chunk, context, bodies, params) {
                var asset = context.stack.head;
                var asset_model = new Model(asset);
                var asset_view = new View(asset_model);
                if (params && params.template) {
                    asset_view.model.set('template', params.template);
                }
                return chunk.map(function(chunk) {
                    chunk.end('<div id="asset_' + asset.slug + '"></div>');
                    asset_view.attach('#asset_' + asset.slug);
                });
            },
        }),

        $el: $('<div></div>'),

        render: function() {
            this.before_render();
            var promise = $.Deferred();
            var context = this.dustbase().push(context);
            var self = this;
            self.$el.hide();
            Dust.render( this.model.template,  this.model.attributes, 
                function(err, out) {  //callback
                    if (err) {
                        Env_config.ERROR_HANDLER(err, self);
                    } else {
                        self.el = out;
                    }
                    self.$el.html(self.el).show();
                    self.after_render();
                }
            );
            return promise;
        },
        load: function() {
            if (this.loaded && this.loaded.state()) { //already has a promise, is being loaded
                return this.loaded;
            }
            if (false) { //FIXME test if local storage of this exists
                //fill model from local storage
                return this.loaded;
            }
            var self = this;
            this.loaded = new $.Deferred();

            this.model.fetch({
                success : function() {
                   //FIXME ask real nice if we cna not have resource uri on here
                   self.model.set(
                       'resource_uri',
                       Env_config.DATA_STORE + 
                           self.model.get('resource_uri')
                   );
                   self.loaded.resolve();
                },
                error : function(err) {
                    Env_config.ERROR_HANDLER(err);
                    self.loaded.resolve();
                },
            });
            return this.loaded;
        },

    });

    return {
        View: View,
        Model: Model,
        Collection: Collection,
    };
})();
