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
  });

  var Collection = Backbone.Collection.extend({
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
        this.before_render();
        var promise = $.Deferred();
        var context = this.dustbase().push(this.model.attributes);
        var self = this;
        self.$el.hide();

        Dust.render( this.model.template,  context, 
          function(err, out) {  //callback
            if (err) {
              Env_config.ERROR_HANDLER(err, self);
            } else {
              self.el = out;
            }
            self.$el.html(self.el).show();
            self.after_render();
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
    chooseTemplate: chooseTemplate,
  };

})();
