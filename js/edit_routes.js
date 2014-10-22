var views = require('./edit_views');
var router = require('./router');

module.exports = {
  "^\/$": views.displayHomepage,
  "\/?:section/[0-9]+/[0-9]+/:slug": views.displayMainContent,
  "\/?:schema/:slug": views.displayMainContent
};
