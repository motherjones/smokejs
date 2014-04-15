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
  var Article = require('./article_edit');
  var $ = require('jquery');


  var router = new Router({
  });


  var editArticle = function(slug) {
    console.log('lolhere');
    var articleModel = new Article.Model({ id: slug });
    var articleView = new Article.View({ model: articleModel });
    console.log(articleView);
    // write what to do when editing an article here
  };
  router.route("edit/article/:slug", editArticle); 

  var curateTopic = function(slug) {
    var articleCollection = new Article.Collection({ id: slug });
    var articleCollectionView 
      = new Article.CollectionView({ collection: articleCollection });
    // write what to do when curating a single list here
    console.log(articleCollectionView);
  };
  router.route("edit/topic/:slug", curateTopic);
  router.route("edit/section/:slug", curateTopic);
  router.route("edit/list/:slug", curateTopic);


  var curateSplashPage = function(slug) {
    console.log(slug);
    // write what to do when curating a list of lists here
  };
  router.route("edit/splashpage/:slug", curateSplashPage);


  $(document).ready(function() {
    Backbone.history.start();
  });

  return;
})();
