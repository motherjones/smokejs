/*global require, window */
var it = require('tape');
var Ad = require('../js/ad');
var render = require('../js/render');
var Chunk = require('./utils').mock_chunk;
var EnvConfig = require('../js/config');
var $ = require('jquery');
var should = require('should');
var utils = require('./utils');


describe("Ads", function() {
  it('ads contain currentAds', function (done) {
    should.exist(Ad);
    Ad.should.have.property('currentAds');
  });
  it("ad url creation", function(done) {
    var url = Ad.getSrc('it');
    t.equal( url,
      EnvConfig.AD_LOCATION +
        '#placement=it&groupid=&key=&height=0&uri=' +
        window.location.pathname,
      'ad iframe src set as expected'
    );
  });
});
it("ad created and rendered", function(done) {
    var dustBase = render.dustBase();
    var chunk = new Chunk();
    shuold.exist(dustBase);
    dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
      .then(function() {
        var el = utils.el(chunk.output);
        var iframeSrc = EnvConfig.AD_LOCATION +
              '#placement=it&groupid=&key=&height=0&uri=' +
              window.location.pathname;
        should(el.attr('src'))
          .eql(iframeSrc, 'ad iframe html rendered correctly');
        Ad.currentAds.should.have.property('it');
        done();
      });
});
it("it reload",
  function(done) {

    t.equal(Ad.key, '', 'Keywords starts unset');
    t.equal(Ad.groupId, '', 'Group Id starts unset');
    var dustBase = render.dustBase();
    var chunk = new Chunk();
    dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
      .then(function() {
          $('body').append($(chunk.output));
          t.ok($('#ad_it'), 'iframe attatched');
          Ad.reload('it keyword');
          t.equal(Ad.key, 'it keyword', 'Keywords set at refresh');
          t.notEqual(Ad.groupId, '', 'Group Id changes on reload');
          t.equal($('#ad_it').attr('src'),
            EnvConfig.AD_LOCATION +
              '#placement=it&groupid=' +
              Ad.groupId +
              '&key=it+keyword' +
              '&height=0&uri=' +
              window.location.pathname,
            'src updates on reload'
          );
          $('#ad_it').remove();
      });
  }
);
it("it event",
  function(done) {

    var dustBase = render.dustBase();
    var chunk = new Chunk();
    dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
    .then(function() {
        $('body').append($(chunk.output));
        t.equal('150px', $('#ad_it').css('height'),
         'height starts at base');
        var event;
        if (document.createEvent) {
          event = document.createEvent("HTMLEvents");
          event.initEvent("message", true, true);
        } else {
          event = document.createEventObject();
          event.eventType = "message";
        }
        event.eventName = "message";
        event.data = { iframe: 'it', height: 100 };
        event.origin = EnvConfig.AD_LOCATION;
        if (document.createEvent) {
          window.document.dispatchEvent(event);
        } else {
          window.document.fireEvent("on" + event.eventType, event);
        }
        setTimeout(function () {
          t.equal('100px', $('#ad_it').css('height'),
           'height changed through event');
        }, 100);
    });
  }
);
