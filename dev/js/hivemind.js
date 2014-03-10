/*global module */
'use strict';

module.exports = (function() {
  var Backbone = require('backbone');
  var $ = Backbone.$ = require('jquery');
  var Dust = require('../../build/js/dust_templates.js')();
  var Env_config = require('./config');
  var templateMap = require('./templateMap');

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
  });

  var Collection = Backbone.Collection.extend({
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
        error : function(err) {
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

    before_render: function(){},
    after_render: function(){},

    attach: function(selector) {
      if (typeof(selector) === 'String') {
        this.$el = $(selector);
      } else {
        this.$el = selector;
      }
      this.render();
    },

    initialize: function() {
      var self = this;
      this.listenTo(this.model, 'change:id', function() {
        self.loaded = null;
        self.render();
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
        var asset = context.stack.head;
        var asset_model = new Model(asset);
        var asset_view = new View(asset_model);
        if (asset.force_template) {
          asset_view.model.set('template', asset.force_template);
        } else if (params && params.template) {
          asset_view.model.set('template', 
            asset.media_type + params.context);
        }
        return chunk.map(function(chunk) {
          chunk.end('<div id="asset_' + asset.slug + '"></div>');
          asset_view.attach('#asset_' + asset.slug);
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
    load: function() {
      return this.collection.load();
    },
    render: function() {
      var self = this;
      this.before_render();
      var promise = $.Deferred();

      $.when( this.load() ).done(function() {
        var context = self.dustbase.push(self.collection.attributes);
        self.$el.hide();

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

      $.when( promise ).done(function() {
        self.collection.each(function(model){
          var view = new View({ model: model});
          if (self.collection.get('child_template') {
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
  };

})();
