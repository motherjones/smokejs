/*global window */
'use strict';

module.exports = (function() {
  var EnvConfig = require('./config');
  var $ = require('jquery');

  var Ad = {};

  Ad.placementToHeight = { //FIXME MAYBE if we need a starting height
    'topbillboard' : 150,
  };

  Ad.CurrentAds = {};

  Ad.groupId = 'unset';

  Ad.key = 'unset';

  Ad.getSrc = function(placement) {
    return EnvConfig.AD_LOCATION + '#' +
      window.unescape($.param({
        'placement': (placement ? placement : 'unplaced'),
        'groupid': Ad.groupId,
        'key':  Ad.key,
        //'height': Ad.placementToHeight[placement],
        'height': 0,
        'uri': window.location.pathname,
      }));
  };

  Ad.reload = function(keywords) {
    Ad.keywords = keywords ? keywords : '';
    Ad.groupId = Math.floor(Math.random()*100000000);

    for (var placement in Ad.CurrentAds) {
      $("ad_" + placement).attr('src', Ad.getSrc(placement));
    }
  };
  
  var listener = function(event){
    if (EnvConfig.AD_LOCATION.match(event.origin)) {
      $("ad_" + event.data.iframe).css('height', event.data.height + 'px');
    }
  };

  if (window.addEventListener){
        window.addEventListener("message", listener, false);
  } else {
        window.attachEvent("onmessage", listener);
  }

  return Ad;

})();
