/*
 * smoke
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
'use strict';

require(['config'], function() {
    require.config({
        baseUrl: 'js/',
        paths: {
            env_config: '../prod_config',
        },
    });


    require([ 'main', ], function(main) {

    });
});
