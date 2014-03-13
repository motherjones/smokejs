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
      return this.model.load();
    },
  });

  var View = Backbone.View.extend({
    model_type: Model,
    self: this,

    before_render: function(){},
    after_render: function(){},

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
        console.log(context.stack.head.schema_name);
        var asset = possibleAssets[context.stack.head.schema_name];
        var assetModel = new asset.Model(asset);
        var assetView = new asset.View(assetModel);
        if (asset.force_template) {
          assetView.model.set('template', asset.force_template);
        } else if (params && params.template) {
          assetView.model.set('template', 
            asset.media_type + params.context);
        }
        return chunk.map(function(chunk) {
          chunk.end('<div id="asset_' + asset.slug + '"></div>');
          assetView.attach('#asset_' + asset.slug);
        });
      },
    }),

    $el: $('<div></div>'),

    render: function() {
      var self = this;
      this.before_render();
      var promise = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase.push(self.model.attributes);
        self.$el.hide();

        console.log(self.model.attributes.template);
        Dust.render( self.model.attributes.template,  context, 
          function(err, out) {  //callback
            if (err) {
              Env_config.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.$el.html(self.el).show();
            self.after_render();

            promise.resolve();
        });
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
      this.before_render();
      var promise = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase.push(self.collection);
        self.$el.hide();

        console.log(self.collection.template);
        Dust.render( self.collection.template,  context, 
          function(err, out) {  //callback
            if (err) {
              Env_config.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.$el.html(self.el).show();
            self.after_render();

            promise.resolve();
        });
      });

      $.when( promise ).done(function() {
        self.collection.each(function(model){
          console.log(model);
          var asset = possibleAssets[model.get('schema_name')];
          var view = new asset.View({ model: model});
          console.log(view);
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
