/*global window */
'use strict';
var EnvConfig = require('./config');
var $ = require('jquery');

/*
var placementToHeight = { //FIXME MAYBE if we need a starting height
  'topbillboard' : 150,
};
*/

exports.groupId = '';
exports.key = '';
exports.currentAds = {};

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

exports.reload = function(keywords) {
  exports.key = keywords ? keywords : '';
  exports.groupId = Math.floor(Math.random()*100000000);
  for (var placement in exports.currentAds) {
    $("#ad_" + placement).attr('src', exports.getSrc(placement));
  }
};


/* set up listener for ads telling us their height */
var listener = function(event){
  if (EnvConfig.AD_LOCATION.match(event.origin)) {
    $("#ad_" + event.data.iframe).css('height', event.data.height + 'px');
  }
};
if (window.addEventListener){
      window.addEventListener("message", listener, false);
} else {
      window.attachEvent("onmessage", listener);
}
