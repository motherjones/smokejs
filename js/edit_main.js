/**
 * Starts the application and sets up browser
 * environment.
 * @module edit_main
 */
module.exports = function() {
  var router = require('./router');
  var routes = require('./routes');
  var editRoutes = require('./edit_routes');
  var _ = require('lodash');
  var $ = require('jquery');
  $(document).ready(function() {
    router.addRoutes(routes.concat(editRoutes));
    router.browserStart();
  });
  return;
}

module.exports();
