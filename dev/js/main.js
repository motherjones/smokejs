/*
 * smoke main
 * https://github.com/motherjones/smoke
 *
 * Copyright (c) 2013 Mother Jones Tech Team
 * Licensed under the MIT license.
 */
/*global document */
'use strict';

(function() {
  var Backbone = require('backbone');
  var Router = require('./router');
  var $ = require('jquery');

  new Router({
  });

  $(document).ready(function() {
    Backbone.history.start();
  });

  return;
})();
