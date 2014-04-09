/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = Backbone.$ = require('jquery');
  var _ = require('underscore');
  var Dust = require('../../build/js/dust_templates.js')();
  var EnvConfig = require('./config');
  var templateMap = require('./templateMap');

  // All hivemind subclasses should push to this
  var possibleAssets = [];

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
      for (var option in options) {
        this.set(option, options[option]);
      }
    },
    urlRoot: EnvConfig.DATA_STORE,
    resource_uri: 'basemodel',
    schema: 'baseModel',
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
    initialize: function(options) {
      if (!options) {return;}
      if (options.slug && !options.id) {
        options.id = options.slug;
      }
      for (var option in options) {
        this[option] = options[option];
      }
      this.url = this.urlRoot() + options.id;
    },
    urlRoot: function() {
      return EnvConfig.DATA_STORE + 'list/';
    },
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) { options.parse = true; }
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        for (var i in resp) {
          collection[i] = resp[i];
        }
        console.log(resp);
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

      this.fetch({
        success : function() {
                    console.log(self);
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
    afterRender: function(){},

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
          var schema = params.schema ?
            params.schema :
            context.stack.head.schema_name;
          var asset = possibleAssets[schema];
          var assetModel = new asset.Model(params);
          var assetView = new asset.View({ model: assetModel });

          return chunk.map(function(chunk) {
            $.when( assetView.render() ).done(function() {
              chunk.end(assetView.el);
            });
          });
        },
        load_collection:  function(chunk, context, bodies, params) {
          var schema = params.schema ?
            params.schema :
            context.stack.head.schema_name;
          var asset = possibleAssets[schema];
          var assetCollection = new asset.Collection(params);
          var assetView = 
            new asset.CollectionView({ collection: assetCollection });

          return chunk.map(function(chunk) {
            $.when( assetView.render() ).done(function() {
              chunk.end(assetView.el);
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

        self.dust.render( self.model.get('template'),  context, 
          function(err, out) {  //callback
            if (err) {
              EnvConfig.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }

            self.afterRender();

            if (self.$el.length) {
              self.$el.html(self.el);
            }

            promise.resolve();
        });
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

        self.dust.render( self.collection.template,  context, 
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

  return {
    View: View,
    Model: Model,
    Collection: Collection,
    CollectionView: CollectionView,
    chooseTemplate: chooseTemplate,
    possibleAssets: possibleAssets,
    Dust: Dust,
  };

})();
