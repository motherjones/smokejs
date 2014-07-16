/*global window */
'use strict';
var EnvConfig = require('./config');
var $ = require('jquery');

  /**
   * @module Ad
   */

  /**
   * The current groupId, sent to the ad server so they can send themed ads,
   * avoid sending multiples of the same ad
   */
exports.groupId = '';
  /**
   * The current keywords of the content we're displaying.
   * Sent to the ad server so we don't get Exxon ads on oil spill articles
   */
exports.key = '';
  /**
   * Current ads. A dictionary (to avoid multiples) w/ a list of current ad
   * placements on the page.
   */
exports.currentAds = {};

  /**
   * Creates the src for an ad iframe
   * @param {string} placement - The placement parameter for our ad server
   * @return {url} the src for an ad iframe
   */
exports.getSrc = function(placement) {
  placement = placement ? placement : 'unplaced';
  return EnvConfig.AD_LOCATION + '#' +
    window.unescape($.param({
      'placement': placement,
      'groupid': exports.groupId,
      'key':  exports.key,
      //'height': placementToHeight[placement],
      'height': 0,
      'uri': window.location.pathname,
    }));
};

  /**
   * Reloads all ad iframes
   * @param {string} keywords - a comma separated string of keywords for
   * the content we're displaying. Sent to the ad server so we don't get
   * ads for Exxon on oil spill articles, for instance
   * @returns void
   */
exports.reload = function(keywords) {
  exports.key = keywords ? keywords : '';
  exports.groupId = Math.floor(Math.random()*100000000);
  for (var placement in exports.currentAds) {
    $("#ad_" + placement).attr('src', exports.getSrc(placement));
  }
};


  /**
   * Resizes iframes when our ad page sends events telling us its height.
   * @param {event} event - the message event
   * @returns void
   * */
exports.listener = function(event){
  if (EnvConfig.AD_LOCATION.match(event.origin)) {
    $("#ad_" + event.data.iframe).css('height', event.data.height + 'px');
  }
};

  /**
   * Sets event listener on the browser
   * @returns void
   */
exports.setAdListener = function() {
  if (window.addEventListener){
        window.addEventListener("message", exports.listener, false);
  } else {
        window.attachEvent("onmessage", exports.listener);
  }
};
