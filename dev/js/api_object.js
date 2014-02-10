/*global module */
'use strict';

module.exports = (function() {
    var $ = require('jquery-browserify');
    var _ = require('underscore');
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var dust = require('./dust_templates.js')();
    var Env_config = require('./config');


    var APIObjectModel = Backbone.Model.extend({
        defaults : {
            context: '*', // This needs to be overwritten by asset/content
            editing: false,
        },
        blacklist: [],
        toJSON: function() {
            return _.omit(this.attributes, this.blacklist);
        }
    });

    var APIObjectView = Backbone.View.extend({
        possible_templates: {
            '*': {
            },
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
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
                [this.model.get('context')];
            this.model.on('change:context', this.change_template);
        },
        change_template: function() {
            this.template = this.possible_templates
                [this.model.get('context')];
            this.render();
        },
        render: function() {
            var promise = $.Deferred();
            var self = this;
            var dustbase = dust.makeBase({
                media_base : Env_config.MEDIA_STORE,
                load_asset: Env_config.DUST_LOAD_ASSET,
            });

            $.when(this.load()).done(function() {
                var context = dustbase.push(self.model.attributes);
                dust.render(
                    self.template,  //name of the template
                    context, //variables to be passed to the template
                    function(err, out) {  //callback
                        if (err) {
                            //throw error
                            Env_config.ERROR_HANDLER(err);
                        } else {
                            self.el = out;
                            if(self.$el === undefined){
                                self.$el = $('<div></div>');
                            }
                            self.$el.html(self.el).hide(0, function(){$(this).show();});
                        }
                        promise.resolve();
                    }
                );
            });
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
                   self.model.set('resource_uri',  Env_config.DATA_STORE + self.model.get('resource_uri').replace('/api/v1/', ''));
                    $.when( self.post_load() )
                        .done( self.loaded.resolve );
                },
                error : function(err) {
                    Env_config.ERROR_HANDLER(err);
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

})();
