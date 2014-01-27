/*
 * smoke
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
'use strict';

require([
        'router',
        'application',
        'backbone'
    ], 
    function(Router, Application, Backbone) {

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

        var router = new Router.Router({
            site_state: site_state,
        });

        site_view.render();

        Backbone.history.start();

        return router;
    }
);
