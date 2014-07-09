var views = require('./edit_views');

var router = require('./router');

//ADD ALL THE EDIT VIEWS TO THE ROUTER
router.addRoute("^/$", views.displayHomepage);
router.addRoute(":schema/:slug", views.displayMainContent);

  /* ADD EDIT SPECIFIC POST PAGE LOAD STUFF HERE
   *   module.exports.callback = function() {
   *     // (setting up content editable, for instnace)
   *   }
   */
module.exports = router;
