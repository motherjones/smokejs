/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'backbone_tastypie',
        'env_config',
        'auth',
    ], 
    function(_, $, Backbone, Tastypie, env_config, Auth) {

        var APIObjectModel = Backbone.Model.extend({
            initialize: function() {
                this.url = env_config.DATA_STORE +
                    this.object_type +
                    '/' + arguments[0].id;
            },
            object_type: 'object',
            defaults : {
                context: '*',
                editing: false,
            },
        });

        var APIObjectView = Backbone.View.extend({
            possible_templates: {
                //context any
                '*': {
                    edit: 'error',
                    view: 'error',
                },
            },
            initialize: function() {
                this.loaded = new $.Deferred();
                this.model.on('change:editing', this.auth_check);
            },
            auth_check: function() {
                            //FIXME check against object type maybe?
                if (!Auth.model.get('can_edit')) {
                    this.model.set('editing', false);
                }
            },
            setup_template_change: function() {
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing')];
                this.model.on('change:context', this.change_template);
                this.model.on('change:editing', this.change_template);
            },
            change_template: function() {
                this.template = this.possible_templates
                    [this.model.get('context')]
                    [this.model.get('editing')];
                this.render();
            },
            render: function() {
                var promise = $.Deferred();
                var self = this;
                var dustbase = dust.makeBase({
                    media_base : env_config.MEDIA_STORE,
                    load_asset: function(chunk, context, bodies, params) {
                        var asset = context.stack.head;
                        return chunk.map(function(chunk) {
                            $.when(
                                asset.render()
                            ).done(function() {
                                chunk.end(asset.el);
                            });
                        });
                    },
                });

                $.when(this.load()).done(function() {
                    var context = dustbase.push(self.model.attributes);
                    dust.render(
                        self.template,  //name of the template
                        context, //variables to be passed to the template
                        function(err, out) {  //callback
                            if (err) {
                                //throw error
                                env_config.ERROR_HANDLER(err);
                            } else {
                                self.$el = self.el = out;
                                promise.resolve();
                            }
                        }
                    );
                });
                return promise;
            },
            load: function() {
                //FIXME WHY IS THIS BEING CALLED W/O A MODEL?
                if (!this.model) { 
                    return;
                }
                var self = this;
                //FIXME maybe not assume?
                if (this.loaded.state() === 'resolved') {
                    return this.loaded;
                }
                if (false) { //FIXME test if local storage of this exists
                    //fill model from local storage
                    return this.loaded;
                }
                this.model.fetch({
                    success : function() {
                        $.when( self.post_load() )
                            .done( self.loaded.resolve );
                    },
                    error : function(err) {
                        env_config.ERROR_HANDLER(err);
                        $.when( self.post_load() )
                            .done( self.loaded.resolve );
                    },
                });
                return this.loaded;
            },
            post_load: function() { return new $.Deferred.resolve(); },
        });

        return {
            'APIObjectModel': APIObjectModel,
            'APIObjectView' : APIObjectView,
        };
    }
);

})(define);

