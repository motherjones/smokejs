/*global module */
'use strict';

module.exports = (function() {
    var HiveMind = require('./hivemind');

    var SiteState = HiveMind.Model.extend({
        defaults: {
          template: 'homepage',
          content_view: null,
        }
    });

    var SiteView = HiveMind.View.extend({
    });

    return {
        'SiteView': SiteView,
        'SiteState': SiteState,
    };
})();
