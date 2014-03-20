/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = Backbone.$ = require('jquery');
  var _ = require('underscore');
  var Dust = require('../../build/js/dust_templates.js')();
  var Env_config = require('./config');
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
    urlRoot: Env_config.DATA_STORE,
    resource_uri: 'basemodel',
    loaded: null,
    load: function() {
      if (this.loaded && this.loaded.state()) { //already has a promise, is being loaded
        return this.loaded;
      }
      if (false) { //FIXME test if local storage of this exists
        //fill model from local storage
        return this.loaded;
      }
      var self = this;
      self.loaded = new $.Deferred();

      this.fetch({
        success : function() {
          self.loaded.resolve();
        },
        error : function(xhr, err) {
          Env_config.ERROR_HANDLER(err);
          self.loaded.resolve();
        },
      });
      return self.loaded;
    },
  });

  var Collection = Backbone.Collection.extend({
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
        collection[method](resp.members, options);
        if (success) { 
          success(collection, resp, options);
        }
        collection.trigger('sync', collection, resp, options);
      };

      return this.sync('read', this, options);
    },
    model: Model,
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

      this.fetch({
        success : function() {
          self.loaded.resolve();
        },
        error : function(xhr, err) {
          Env_config.ERROR_HANDLER(err);
          self.loaded.resolve();
        },
      });
      return this.loaded;
    },
  });

  var View = Backbone.View.extend({
    model_type: Model,
    self: this,

    beforeRender: function(){},
    afterRender: function(){},

    attach: function(selector) {
      if (typeof(selector) === 'string') {
        this.$el = $(selector);
      } else {
        this.$el = selector;
      }
      return this.render();
    },

    initialize: function() {
      var self = this;
      this.listenTo(this.model, 'change:id', function() {
        self.loaded = null;
        self.render();
      });
      this.listenTo(this.model, 'change:slug', function() {
        self.model.set('id', this.model.slug);
      });
      this.listenTo(this.model, 'change:template', function() {
        self.render();
      });
    },

    when: function(promises) {
      return $.when.apply(null, promises);
    },

    dustbase: Dust.makeBase({
      media_base : Env_config.MEDIA_STORE,
      load_asset:  function(chunk, context, bodies, params) {
        var schema = context.stack.head.schema_name ?
          context.stack.head.schema_name :
          params.schema;
        var asset = possibleAssets[schema];
        var assetModel = new asset.Model();
        for (var param in params) {
          assetModel.set(param, params[param]);
        } //This setting must be done before initing the model
        var assetView = new asset.View({ model: assetModel });

        if (asset.force_template) {
          assetModel.set('template', asset.force_template);
        } else if (params.template) {
          assetModel.set('template', 
            asset.media_type + params.context);
        }
        return chunk.map(function(chunk) {
          chunk.end('<div id="asset_' + assetModel.get('slug') + '"></div>');
          assetView.attach('#asset_' + assetModel.get('slug'));
        });
      },
      load_collection:  function(chunk, context, bodies, params) {
        var schema = context.stack.head.schema_name ?
          context.stack.head.schema_name :
          params.schema;
        var asset = possibleAssets[schema];
        var assetCollection = new asset.Collection(asset);
        var assetView = 
          new asset.CollectionView({ collection: assetCollection });

        for (var param in params) {
          assetCollection.set(param, params[param]);
        }
        if (asset.force_template) {
          assetView.collection.set('template', asset.force_template);
        } else if (params.template) {
          assetView.collection.set('template', 
            asset.media_type + params.context);
        }
        return chunk.map(function(chunk) {
          chunk.end('<div id="asset_' + assetCollection.get('slug') + '"></div>');
          assetView.attach('#asset_' + assetCollection.get('slug'));
        });
      },
      load_content:  function(chunk, context, bodies, params) {
        var contentPromise = new $.Deferred();
        var content = '';
        $.get(
          Env_config.DATA_STORE + params.data_uri,
          function(data) {
            console.log('data fetched');
            content = data;
            contentPromise.resolve();
          }
        );
        return chunk.map(function(chunk) {
          $.when(
            contentPromise
          ).done(function() {
            chunk.end(content);
          });
        });
      },
    }),

    $el: $('<div></div>'),

    render: function() {
      var self = this;
      this.beforeRender();
      var promise = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase.push(self.model.attributes);
        self.$el.hide();

        Dust.render( self.model.attributes.template,  context, 
          function(err, out) {  //callback
            if (err) {
              Env_config.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.$el.html(self.el).show();

            self.$el.find('load_asset').each(function() {
              console.log(this);
            });
            self.$el.find('load_collection').each(function() {
              console.log(this);
            });

            self.afterRender();

            promise.resolve();
        });
      });
      return promise;
    },
    load: function() {
      return this.model.load();
    },
  });

  var CollectionView = View.extend({
    initialize: function() {
      var self = this;
      this.listenTo(this.collection, 'change:id', function() {
        self.loaded = null;
        self.render();
      });
      this.listenTo(this.collection, 'change:template', function() {
        self.render();
      });
    },
    load: function() {
      return this.collection.load();
    },
    render: function() {
      var self = this;
      this.beforeRender();
      var promise = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase.push(self.collection);
        self.$el.hide();

        Dust.render( self.collection.template,  context, 
          function(err, out) {  //callback
            if (err) {
              Env_config.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.$el.html(self.el).show();
            self.afterRender();

            promise.resolve();
        });
      });

      $.when( promise ).done(function() {
        self.collection.each(function(model){
          var asset = possibleAssets[model.get('schema_name')];
          var view = new asset.View({ model: model});
          if (self.collection.get('child_template')) {
            model.set('template', self.collection.get('child_template')); 
          }
          view.attach(self.$el.find('.collection_content'));
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
  };

})();
