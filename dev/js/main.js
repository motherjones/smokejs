/*
 * smoke
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
'use strict';

require([
        'controller',
        'application',
    ], 
    function(controller, application) {
        // start the app instead of fucking around with jquery
        //controller.router.navigate('/article:slug', true);
        var siteState = new application.SiteState();
        var siteView = new application.SiteView({
            model: siteState
        });
        siteView.render();

        siteState.on('change:current_view', siteView.updateContent);

    }
);
