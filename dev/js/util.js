/*global define */


(function(define) {

define('util', [
        'underscore',
        'backbone',
        'dust',
        'env_config',
        'jquery',
    ], 
    function(_, Backbone, dust, env_config, $) {
        return {
            DATA_STORE : env_config.DATA_STORE,
            ERROR_HANDLER : env_config.ERROR_HANDLER,
            dustbase : dust.makeBase({
                media_base : env_config.MEDIA_STORE,
                load_asset: function(chunk, context) {
                    var assets = require('assets');
                    return chunk.map(function(chunk) {
                        var assetModel = new assets.Asset(
                            context.stack.head.attribute
                        )
                        var assetView = new assets.AssetView({
                            model: assetModel
                        });
                        $.when(
                            assetView.render()
                        ).done(function() {
                            chunk.end(assetView.el);
                        });
                    });
                },
            }),
            render: function(view) {
                var promise = $.Deferred();
                var context = this.dustbase.push(view.model.attributes);

                dust.render(
                    view.template,  //name of the template
                    context, //variables to be passed to the template
                    function(err, out) {  //callback
                        if (err) {
                            //throw error
                            env_config.ERROR_HANDLER(err);
                        } else {
                            view.$el = view.el = out;
                            promise.resolve();
                        }
                    }
                );
                return promise;
            },
        };
    }
);

})(define);
