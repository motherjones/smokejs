/*global document */
'use strict';

/**
 * Starts the application and sets up browser
 * environment.
 * @module main
 */
(function() {
  var router = require('./edit_router');
  var $ = require('jquery');
  $(document).ready(function() {
    router.browserStart();
  });
  return;
})();

