/*global window, document */
'use strict';
var views = require('./views');
var Router = require('routes');
var ad = require('./ad');
var $ = require('jquery');
var Promise = require('promise-polyfill');

//In general please use exports.name for simplicity
//unless otherwise necessary not to.

/**
 * Sets up routes and deals with click hijacking and
 * adding content to the DOM.
 * @module router
 */
module.exports = {
  "\/?:slug(politics|media|environment)\/?$": views.displayMainContent,
  "\/?:schema/:slug": views.displayMainContent,
  "\/?:section/[0-9]+/[0-9]+/:slug": views.displayMainContent,
  "^\/$": views.displayHomepage,
  "^login\/?$": views.displayLogin
};

