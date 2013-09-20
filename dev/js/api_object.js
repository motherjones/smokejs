/*global define */
'use strict';

(function(define) {

define([
        'underscore',
        'jquery',
        'backbone',
        'backbone_tastypie',
        'dust',
        'env_config',
        'auth',
    ], 
    function(_, $, Backbone, Tastypie, dust, env_config, Auth) {

        var APIObjectModel = Backbone.Model.extend({
            defaults : {
                context: '*', // This needs to be overwritten by asset/content
                editing: false,
            },
            blacklist: [],
            toJSON: function(options) {
                return _.omit(this.attributes, this.blacklist);
            }
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
                console.log(Backbone.sync);
                this.model.on('change:editing', this.auth_check);
                this.listenTo(this.model, 'change', this.render);
            },
            auth_check: function() {
                            //FIXME check against object type maybe?
                if (!Auth.model.get('can_edit')) {
                    this.model.set('editing', false);
                }
            },
            get_$el: function() {
                if (!this.$el) {
                    this.$el = $(
                        '#' + 
                        this.model.get('object_type') +
                        this.model.get('slug')
                    );
                }
                return this.$el;
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
                        var asset_view;
                        if (asset.member) {
                            for (var i = 0; i < self.member_views.length; i++) {
                                if (self.member_views[i].model.get('slug') === asset.member.slug) {
                                    asset_view = self.member_views[i];
                                    break;
                                }
                            }
                        } else {
                            asset_view = self.attribute_views[asset.keyword];
                        }
                        return chunk.map(function(chunk) {
                            $.when(
                                asset_view.render()
                            ).done(function() {
                                var asset_id = 'asset_' + asset_view.model.get('slug');
                                $.when(promise).done(function() {
                                    $('#' + asset_id, self.$el).append(asset_view.$el);
                                });
                                chunk.end('<div id="asset_' + asset_view.model.get('slug') + '"></div>');
                                //chunk.end(asset_view.el);
                            });
                        });
                    },
                });

                $.when(this.load()).done(function() {
                    var context = dustbase.push(self.model.attributes);
                    console.log(context);
                    dust.render(
                        self.template,  //name of the template
                        context, //variables to be passed to the template
                        function(err, out) {  //callback
                            if (err) {
                                //throw error
                                env_config.ERROR_HANDLER(err);
                            } else {
                                self.el = out;
                                if(self.$el == undefined){
                                    self.$el = $('<div></div>');
                                }
                                console.log(self.$el.html());
                                self.$el.html(self.el).hide(0, function(){$(this).show();});
                                if (self.model.get('editing')) {
                                    self.set_form();
                                }
                            }
                            promise.resolve();
                        }
                    );
                });
                if (this.model.get('editing')) { 
                    $.when(promise).done(function() {
                        self.set_editing_events();
                    });
                }
                return promise;
            },
            load: function() {
                var changed = this.model.changedAttributes();
                if (changed.length==false) { //no id, must be new
                    $.when( this.post_load() )
                        .done( this.loaded.resolve );
                    return;
                }

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
                       self.model.set('resource_uri',  env_config.DATA_STORE + self.model.get('resource_uri').replace('/api/v1/', ''));
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
            post_to_mirrors: function(e) {
                var self = this;
                // make asset look like it's doing something till it's done
                var promise = $.Deferred();
                this.$el.addClass('disabled');
                console.log('post_to_mirrors');
                $.when( this.process_form() )
                    .done( function() {
                        console.log('test presave');
                        console.log(Backbone.Tastypie);
                        self.model.save(null, {
                            'success': function(){
                               //FIXME change this to redraw
                               self.model.set('data_url', self.model.get('data_url') + '?q=' +  Math.floor((Math.random()*10)+1));
                               promise.resolve();     
                            }
                        });
                    });

                $.when( promise ).done(function() {
                    self.$el.removeClass('disabled');
                });
                return promise;
                //Backbone.emulateJSON = true;
            },
            set_editing_events: function() {
                var self = this;
                if (!this.model.get('editing')) { 
                    return; 
                }
                $('input[type="submit"]', this.form).attr('disabled', 'disabled');
                var submit_enabled = false;
                $('.editable', this.form).change(function() {
                    if (!submit_enabled) {
                        submit_enabled = true;
                        $('input[type="submit"]', self.form).attr('disabled', false);
                    }
                    //this is the element here, fyi
                    //self.model.set('content', this.val());
                    // save to local storage at this point too maybe
                });
                this.form.submit(function(e) {
                    e.preventDefault();
                    $.when(self.post_to_mirrors()).done(function() {
                        console.log('done submitting');
                        console.log(self.$el);
                        self.render();
                    });
                    return false;
                });
                /*
                $('input[type="submit"]', this.form).click(function() {
                    self.form.submit
                });
                */
            },
                        
        });

        return {
            'APIObjectModel': APIObjectModel,
            'APIObjectView' : APIObjectView,
        };
    }
);

})(define);

