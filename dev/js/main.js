/*
 * smoke main
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
'use strict';

(function() {
    var Application = require('./application');
    var Backbone = require('backbone');
    var Router = require('./router');


    //FIXME do some figuring here, see what initial site state should be
    var site_state = new Application.SiteState();

    var site_view = new Application.SiteView({
        model: site_state,
    });

    new Router({
        site_state: site_state,
        main_content: site_state,
    });


    Backbone.history.start();

    site_view.render();

    return;
})();
