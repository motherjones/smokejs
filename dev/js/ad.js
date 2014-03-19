/*global module, window */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var EnvConfig = require('./config');
  var $ = require('jquery');

  var CurrentAds = {};

  var Model = HiveMind.Model.extend({
    defaults: {
      template: 'ad_iframe',
      resizable: 'resizable',
    },
    load: function() { 
      this.loaded = new $.Deferred();
      this.loaded.resolve();
      return this.loaded;
    },
  });

  var View = HiveMind.View.extend({
    initialize: function() {
      var self = this;
      CurrentAds[this.model.get('placement')] = this;
      this.model.set('slug', 'ad_' + this.model.get('placement'));
      this.on('pagechange', function() {
        self.reload();
      });
      this.setParams();
    },
    setParams: function() {
      this.model.set('params', window.unescape($.param({
        'placement': this.model.get('placement'), // for IE
        'groupid': this.model.get('groupid'),
        'key':  this.model.get('key'),
        'height': this.model.get('data-height'),
        'uri': window.location.pathname,
      })));
      this.model.set('src', EnvConfig.AD_LOCATION + '#' + this.model.get('params'));
    },
    reload: function() {
      this.setParams();
      this.$el.find('iframe').attr('src',
        this.model.get('src') + '#' + this.model.get('params')
      );
    },
  });
  
  var listener = function(event){
    if (EnvConfig.AD_LOCATION.match(event.origin)) {
      var ad = CurrentAds[event.data.iframe].$el.find('iframe');
      if (ad.attr("data-resizable") === "resizable") {
        ad.css('height', event.data.height + 'px');
      }
    }
  };

  if (window.addEventListener){
        window.addEventListener("message", listener, false);
  } else {
        window.attachEvent("onmessage", listener);
  }

  var Ad = {
    'View': View,
    'Model': Model,
    'CurrentAds': CurrentAds,
  };

  HiveMind.possibleAssets['ad'] = Ad;

  return Ad;

})();
