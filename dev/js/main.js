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
  var router = require('./router');
  var $ = require('jquery');

  $(document).ready(function() {
    router.browserStart();
  });

  return;
})();
