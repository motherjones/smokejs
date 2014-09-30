var views = require('./edit_views');

var router = require('./router');

//ADD ALL THE EDIT VIEWS TO THE ROUTER
router.addRoute("^\/$", views.displayMainContent);
router.addRoute("\/?:section/[0-9]+/[0-9]+/:slug", views.displayMainContent);
router.addRoute("\/?:schema/:slug", views.displayMainContent);

  /* ADD EDIT SPECIFIC POST PAGE LOAD STUFF HERE
   * if we can make the make editable fucntion smarter, we can ditch
   * overwriting the normal views w/ edit views, and make things editable
   * by putting the edit function here in the callback
   *   module.exports.callback = function() {
   *     // (setting up content editable, for instnace)
   *   }
   */
module.exports = router;
