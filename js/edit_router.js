var views = require('./edit_views');

module.exports = require('./api').Component;

//ADD ALL THE EDIT VIEWS TO THE ROUTER
module.exports.addRoute("^/$", views.display_homepage);
module.exports.addRoute("/:schema/:slug", views.display_main_content);

  /* ADD EDIT SPECIFIC POST PAGE LOAD STUFF HERE
   *   module.exports.callback = function() {
   *     // (setting up content editable, for instnace)
   *   }
   */
