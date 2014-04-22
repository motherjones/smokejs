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
  var HiveMind = require('./hivemind_edit');
  var $ = require('jquery');


  var router = new Router({
  });


  var editStory = function(slug) {
    var model = new HiveMind.Model({ id: slug });
    var view = new HiveMind.View({ model: model });
    model.set('template', 'story_edit');
    $.when( view.load() ).done(function() {
      view.attach('body');
    });
  };
  router.route("edit/story/:slug", editStory); 

  var curateTopic = function(slug) {
    var storyCollection = new HiveMind.Collection({ id: slug });
    var storyCollectionView 
      = new HiveMind.CollectionView({ collection: storyCollection });
    // write what to do when curating a single list here
    console.log(storyCollectionView);
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
