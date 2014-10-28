/*global window, document */
'use strict';

var edit_views = require('./edit_views');

module.exports = [
  ["^\/$", edit_views.displayMainContent],
  ["\/?:section/[0-9]+/[0-9]+/:slug", edit_views.displayMainContent],
  ["\/?:schema/:slug", edit_views.displayMainContent]
];
