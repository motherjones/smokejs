/*
 * smoke
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
'use strict';

(function() {
    var Router = require('./router');
    var Application = require('./application');
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');


    //FIXME do some figuring here, see what initial site state should be
    var site_state = new Application.SiteState();

    var site_view = new Application.SiteView({
        model: site_state,
    });

    site_state.on('change:content_view', function() {
        site_view.updateContent();
    });
    site_state.on('change:spec', function() {
        site_view.updateLayout();
    });

    new Router.Router({
        site_state: site_state,
    });

    site_view.render();

    Backbone.history.start();

    return;
})();
