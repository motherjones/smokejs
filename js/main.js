/*
 * smoke main
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
/*global document */
'use strict';

/**
 * Starts the application and sets up browser
 * environment.
 * @module main
 */
module.exports = function() {
  var router = require('./router');
  var routes = require('./routes');
  var $ = require('jquery');
  router.addRoutes(routes);
  $(document).ready(function() {
    router.browserStart();
  });
  return;
}

module.exports();
