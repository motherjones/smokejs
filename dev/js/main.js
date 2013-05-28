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
        'page',
    ], 
    function(controler, application, page) {
        //FIXME do some figuring here, see what initial site state should be
        var siteState = new application.SiteState();

        var pageModel = new page.PageModel();
        siteState.currentView = new page.PageView({
            model: pageModel
        });

        var siteView = new application.SiteView({
            model: siteState
        });
        siteView.render();

        siteState.on('change:current_view', siteView.updateContent);

    }
);
