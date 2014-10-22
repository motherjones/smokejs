/**
 * Starts the application and sets up browser
 * environment.
 * @module edit_main
 */
module.exports = function() {
  var router = require('./router');
  var routes = require('./routes');
  var edit_routes = require('./edit_routes');
  var _ = require('lodash');
  var $ = require('jquery');
  router.addRoutes(_.merge(_.clone(routes), edit_routes));
  $(document).ready(function() {
    router.browserStart();
  });
  return;
}

module.exports();
