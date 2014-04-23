/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = Backbone.$ = require('jquery');
  var _ = require('underscore');
  var Dust = require('../../build/js/dust_templates')();
  var EnvConfig = require('./config');
  var templateMap = require('./templateMap');
  var HiveMind = {}; // to be extended

  var chooseTemplate = function(component, component_parent) {
    var parentTemplate = 'undefined';
    var schemaName = component.schema_name;
    var contentType = component.content_type;

    var parentDefined = (typeof component_parent !== 'undefined');
    if ( parentDefined ) {
      parentTemplate = chooseTemplate(component_parent);
      if ( parentTemplate === null ) {
        return null;
      }
    }

    var hasSchemaName = schemaName in templateMap[parentTemplate];
    if ( !hasSchemaName ) {
      return null;
    }

    var hasContentType = contentType in templateMap[parentTemplate][schemaName];
    if ( !hasContentType ) {
      return null;
    }

    return templateMap[parentTemplate][schemaName][contentType];
  };

  var Model = Backbone.Model.extend({
    initialize: function(options) {
      if (!options) {return;}
      if (options.slug && !options.id) {
        options.id = options.slug;
      }
      if (options.schema_name && !options.template) {
        options.template = options.schema_name;
      }
      for (var option in options) {
        this.set(option, options[option]);
      }
    },
    urlRoot: EnvConfig.DATA_STORE + '/mirrors/component',
    loaded: null,
    load: function() {
      if (this.loaded) { //already has a promise
        return this.loaded;
      }
      if (false) { //FIXME test if local storage of this exists
        //fill model from local storage
        return this.loaded;
      }
      var self = this;
      var promise = self.loaded = new $.Deferred();

      this.fetch({
        success : function() {
          promise.resolve();
        },
        error : function(xhr, err) {
          EnvConfig.ERROR_HANDLER(err);
          promise.resolve();
        },
      });
      return self.loaded;
    },
  });

  var Collection = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.models = models;
      if (!options) {return;}
      if (options.slug && !options.id) {
        options.id = options.slug;
      }
      if (options.schema_name && !options.template) {
        options.template = options.schema_name;
      }

      for (var option in options) {
        this[option] = options[option];
      }
      this.url = this.urlRoot + '/' + options.id;
    },
    urlRoot: EnvConfig.DATA_STORE + '/mirrors/component',
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) { options.parse = true; }
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        for (var i in resp) {
          collection[i] = resp[i];
        }
        var method = options.reset ? 'reset' : 'set';
        //collection[method](resp.members, options);
        collection[method](resp.attributes.main, options);
        if (success) { 
          success(collection, resp, options);
        }
        collection.trigger('sync', collection, resp, options);
      };

      return this.sync('read', this, options);
    },
    model: Model,
    load: function() {
      if (this.loaded) { //already has a promise, is being loaded
        return this.loaded;
      }
      if (false) { //FIXME test if local storage of this exists
        //fill model from local storage
        return this.loaded;
      }
      var self = this;
      this.loaded = new $.Deferred();

      if (!this.id) {
        this.loaded.resolve();
        return;
      }

      this.fetch({
        success : function() {
          self.loaded.resolve();
        },
        error : function(xhr, err) {
          EnvConfig.ERROR_HANDLER(err);
          self.loaded.resolve();
        },
      });
      return this.loaded;
    },
  });

  var View = Backbone.View.extend({
    model_type: Model,
    self: this,

    dust: Dust,

    beforeRender: function(){},
    afterRender: function(){
    },

    attach: function(selector) {
      var self = this;
      if (typeof(selector) === 'string') {
        this.$el = $(selector);
      } else {
        this.$el = selector;
      }
      $.when( this.render() ).done(function() {
        if (self.$el.length) {
          self.$el.html(self.el);
        }
      });
      return this.rendered;
    },

    initialize: function() {
      var self = this;
      this.listenTo(this.model, 'change:id', function() {
        self.loaded = null;
        self.rendered = null;
        self.attach(self.$el);
      });
      this.listenTo(this.model, 'change:template', function() {
        self.rendered = null;
        self.attach(self.$el);
      });
    },

    when: function(promises) {
      return $.when.apply(null, promises);
    },

    dustbase: function() {
      if (this._dustbase) {
        return this._dustbase;
      }
      this._dustbase = this.dust.makeBase({
        media_base : EnvConfig.MEDIA_STORE,
        load_asset:  function(chunk, context, bodies, params) {
          var assetModel = new Model(params);
          var assetView = new View({ model: assetModel });

          return chunk.map(function(chunk) {
            $.when( assetView.render() ).done(function() {
              chunk.end(assetView.el);
            });
          });
        },
        load_collection:  function(chunk, context, bodies, params) {
          var models = params.models ? params.models : [];
          for (var i = 0; i < models.length; i++) {
            models[i] = new Model(models[i]);
          }
          var collection = new Collection(models, params);
          var view = new CollectionView({ collection: collection });

          return chunk.map(function(chunk) {
            $.when( view.render() ).done(function() {
              chunk.end(view.el);
            });
          });
        },
        load_ad:  function(chunk, context, bodies, params) {
          var assetModel = new HiveMind.Ad.Model(params);
          var assetView = new HiveMind.Ad.View({ model: assetModel });

          return chunk.map(function(chunk) {
            $.when( assetView.render() ).done(function() {
              chunk.end(assetView.el);
            });
          });
        },
        load_markdown:  function(chunk, context, bodies, params) {
          if (!HiveMind.Markdown) {
            HiveMind.Markdown = require('./markdown');
          }
          var model = new HiveMind.Markdown.Model(params);
          var view = new HiveMind.Markdown.View({ model: model });

          return chunk.map(function(chunk) {
            $.when( view.render() ).done(function() {
              chunk.end(view.el);
            });
          });
        },
      });
      return this._dustbase;
    },

    $el: $('<div></div>'),

    rerender: function() {
      this.rendered = null;
      this.render();
    },

    render: function() {
      if (this.rendered) {
        return this.rendered;
      }
      var self = this;
      this.beforeRender();
      var promise = this.rendered = new $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase().push(self.model.attributes);
        var template = self.model.get('template') ?
          self.model.get('template') :
          self.model.get('schema_name');

        self.dust.render( template, context, 
          function(err, out) {  //callback
            if (err) {
              EnvConfig.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }


            if (self.$el.length) {
              self.$el.html(self.el);
            }

            self.afterRender();
            promise.resolve();
          }
        );
      });
      return self.rendered;
    },
    load: function() {
      return this.model.load();
    },
  });

  var CollectionView = View.extend({
    initialize: function() { //needs to be here to overwrite base view
    },
    load: function() {
      return this.collection.load();
    },

    render: function() {
      if (this.rendered) {
        return this.rendered;
      }
      var self = this;
      this.beforeRender();
      var promise = this.rendered = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase().push(self.collection);
        var template = self.collection.template ?
          self.collection.template :
          self.collection.schema_name;

        self.dust.render( template,  context, 
          function(err, out) {  //callback
            if (err) {
              EnvConfig.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.afterRender();

            promise.resolve();
        });
      });

      return promise;
    },
  });

  HiveMind.View = View;
  HiveMind.Model = Model;
  HiveMind.Collection = Collection;
  HiveMind.CollectionView = CollectionView;
  HiveMind.chooseTemplate = chooseTemplate;
  HiveMind.Dust = Dust;
  
  return HiveMind;

})();
