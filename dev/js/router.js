/*global module */
'use strict';

module.exports = (function() {
    var Asset = require('./asset');
    var Backbone = require('./libs/backbone-min');
    var Content = require('./content');


    return Backbone.Router.extend({

        initialize: function(options) {
            this.site_state = options.site_state;
        },

        routes : {
            "article/:slug" : "display_main_content",
            "asset/:slug" : "display_asset",
            //FIXME move edit elsewhere
            "edit/article/:slug" : "edit_content",
            "new/:spec" : "create_content",
        },

        display_main_content : function(slug) {
            var self = this;
            var content = new Content.ContentModel({
                id: slug,
            });
            var content_view = new Content.ContentView({ model: content });
            self.site_state.set({
                content_view : content_view,
            });
        },

        display_asset : function(slug) {
            var assetModel = new Asset.Asset({
                id: slug,
            });

            var assetView = new Asset.AssetView({
                model: assetModel
            });

            assetView.render();
        },
        create_content: function(spec) {
            var content = new Content.ContentModel({
                id: '',
                editing: true,
                spec: spec,
                attributes: {
                    master: {
                        attribute: {
                            data_url : '',// FIXME point this at a mj image
                            id: '',
                            editing: true,
                        },
                        keyword: 'master',
                    },
                },
            });
            var content_view = new Content.ContentView({model : content});
            this.site_state.set({
                content_view : content_view,
            });
        },
        edit_content : function(slug) {
            var self = this;
            var content = new Content.ContentModel({
                id: slug,
                editing: true,
            });
            var content_view = new Content.ContentView({model : content});
            $.when( content_view.load() )
                .done(function() {
                    content_view.model.set('editing', true);
                    content_view.child_assets_editing(true);
                    self.site_state.set({spec : 'page'});
                    self.site_state.set({
                            content_view : content_view
                    });
                });
        },
    });

})();
