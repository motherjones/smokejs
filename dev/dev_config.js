/*global module */
'use strict';

module.exports = (function() {

    return {
        DATA_STORE : 'http://localhost:8000/api/v1/',
        MEDIA_STORE : 'http://localhost:8000', // CHANGEME MAKE ME REAL
        ERROR_HANDLER : function(err) { console.log(err); },
        DUST_LOAD_ASSET : function(chunk, context) {
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
    };

})();
