/*global require, window */
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
    should(Ad).have.property('currentAds');
    done();
  });

  it("ads create urls from placement", function(done) {
    var url = Ad.getSrc('it');
    should(url).eql(
      EnvConfig.AD_LOCATION +
        '#placement=it&groupid=&key=&height=0&uri=' +
        window.location.pathname
    );
    done();
  });
  it("ads are creatable and render", function(done) {
      var dustBase = render.dustBase();
      var chunk = new Chunk();
      should.exist(dustBase);
      dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
        .then(function() {
          var el = utils.el(chunk.output);
          var iframeSrc = EnvConfig.AD_LOCATION +
                '#placement=it&groupid=&key=&height=0&uri=' +
                window.location.pathname;
          var elSrc = el.attr('src');
          should(elSrc)
            .eql(iframeSrc);
          Ad.currentAds.should.have.property('it');
          done();
        });
  });
  it("ads reload",
    function(done) {
      should(Ad.key).be.empty;
      should(Ad.groupId).be.empty;
      var dustBase = render.dustBase();
      var chunk = new Chunk();
      dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
        .then(function() {
            $('body').append($(chunk.output));
            should($('#ad_it')).be.ok;
            Ad.reload(['it keyword', 'two keywords']);
            should(Ad.key).not.be.empty;
            should(Ad.key).eql('it-keyword+two-keywords');
            Ad.groupId.should.be.a.Number;
            should($('#ad_it').attr('src')).eql(
              EnvConfig.AD_LOCATION +
                '#placement=it&groupid=' +
                Ad.groupId +
                '&key=it-keyword+two-keywords' +
                '&height=0&uri=' +
                window.location.pathname,
              'src updates on reload'
            );
            $('#ad_it').remove();
            done();
        });
    }
  );
  it("events change ad height",
    function(done) {
      var dustBase = render.dustBase();
      var chunk = new Chunk();
      Ad.setAdListener();
      dustBase.global.ad(chunk, {}, {}, {placement: 'it'})
      .then(function() {
          $('body').append($(chunk.output));
          should($('#ad_it').css('height')).eql('150px');

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
            should( $('#ad_it').css('height') ).eql('100px');
            done();
          }, 100);
      });
    }
  );
});
