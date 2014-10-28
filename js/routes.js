/*global window, document */
'use strict';

var views = require('./views');

module.exports = [
  ["\/?:slug(politics|media|environment)\/?$", views.displayMainContent],
  ["\/?:schema/:slug", views.displayMainContent],
  ["\/?:section/[0-9]+/[0-9]+/:slug", views.displayMainContent],
  ["^\/$", views.displayMainContent]
];
