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
  var Application = require('./application');
  var Backbone = require('backbone');
  var Router = require('./router');
  var $ = require('jquery');


  //FIXME do some figuring here, see what initial site state should be
  var siteModel = new Application.Model({ template: 'homepage' });

  var siteView = new Application.View({
    model: siteModel,
  });


  new Router({
    siteModel: siteModel,
    siteView: siteView,
  });

  $(document).ready(function() {
    console.log('document ready');
    siteView.attach('body');
    Backbone.history.start();
    console.log('history started');
    console.log(Backbone.history);
  });

  return;
})();
