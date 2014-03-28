/*global module */
'use strict';

module.exports = (function() {
  var Router = require('./router');
  var Article = require('./article_edit');

  Router.routes["edit/article/:slug"] = "editArticle";

  Router.editArticle = function(slug) {
    var articleModel = new Article.Model({ id: slug });
    var articleView = new Article.View({ model: articleModel });
    console.log(articleView);
    // write what to do when editing an article here
  };

  Router.routes["edit/topic/:slug"] = "curateTopic";
  Router.routes["edit/section/:slug"] = "curateTopic";
  Router.routes["edit/list/:slug"] = "curateTopic";

  Router.curateTopic = function(slug) {
    var articleCollection = new Article.Collection({ id: slug });
    var articleCollectionView 
      = new Article.CollectionView({ collection: articleCollection });
    // write what to do when curating a single list here
    console.log(articleCollectionView);
  };

  Router.routes["edit/splashpage/:slug"] = "curateSplashpage";

  Router.curateSplashPage = function(slug) {
    console.log(slug);
    // write what to do when curating a list of lists here
  };

  return Router;

})();
