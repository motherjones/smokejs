/*global require, window */

var test = require('tape');
var Ad = require('../js/ad');
var render = require('../js/render');
var Chunk = require('./dust_chunk_mock');
var EnvConfig = require('../js/config');
var $ = require('jquery');

test( "pulled libs", function(t) {
    t.plan(2);
    t.ok(Ad, "ad lib is here");
    t.ok(Ad.CurrentAds, "ad lib has storage to retain which ads exist");
});

test("test ad url creation",
  function(t) {
    t.plan(1);
    var url = Ad.getSrc('test');
    t.equal( url,
      EnvConfig.AD_LOCATION +
        '#placement=test&groupid=&key=&height=0&uri=' +
        window.location.pathname,
      'ad iframe src set as expected'
    );
  }
);

test("test ad creation",
  function(t) {
    t.plan(4);

    var dustBase = render.dustBase();
    var chunk = new Chunk();
    t.ok(dustBase, 'dust base created');


    $.when(dustBase.global.ad(chunk, {}, {}, {placement: 'test'}))
      .done(function() {
          t.equal( chunk.output, 
            '<iframe class="ads" data-placement="test" id="ad_test"data-resizable="resizable"scrolling="no" frameborder="0"sandbox="allow-scripts allow-same-origin"src="' +
              EnvConfig.AD_LOCATION +
                '#placement=test&groupid=&key=&height=0&uri=' +
                window.location.pathname + 
              '"seamless></iframe>',
            'ad iframe html rendered correctly'
          );
      });

    t.equal( chunk.promise.state(), 'resolved',
      'chunk properly sets promise'
    );

    t.ok(Ad.CurrentAds['test'],
      'ad creation puts its placement in the list of ads'
    );

  }
);

test("test reload",
  function(t) {
    t.plan(6);

    t.equal(Ad.key, '', 'Keywords starts unset');
    t.equal(Ad.groupId, '', 'Group Id starts unset');

    var dustBase = render.dustBase();
    var chunk = new Chunk();
    $.when(dustBase.global.ad(chunk, {}, {}, {placement: 'test'}))
      .done(function() {
          $('body').append($(chunk.output)); 
          t.ok($('#ad_test'), 'iframe attatched');

          Ad.reload('test keyword');

          t.equal(Ad.key, 'test keyword', 'Keywords set at refresh');
          t.notEqual(Ad.groupId, '', 'Group Id changes on reload');

          t.equal($('#ad_test').attr('src'),
            EnvConfig.AD_LOCATION +
              '#placement=test&groupid=' +
              Ad.groupId +
              '&key=test+keyword' +
              '&height=0&uri=' +
              window.location.pathname,
            'src updates on reload'
          );
          $('#ad_test').remove();
      });
  }
);

test("test event",
  function(t) {
    t.plan(2);
    var dustBase = render.dustBase();
    var chunk = new Chunk();
    $.when(dustBase.global.ad(chunk, {}, {}, {placement: 'test'}))
    .done(function() {
        $('body').append($(chunk.output)); 
        t.equal('150px', $('#ad_test').css('height'),
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
        event.data = { iframe: 'test', height: 100 };
        event.origin = EnvConfig.AD_LOCATION;

        if (document.createEvent) {
          window.document.dispatchEvent(event);
        } else {
          window.document.fireEvent("on" + event.eventType, event);
        }

        setTimeout(function () {
          t.equal('100px', $('#ad_test').css('height'),
           'height changed through event');
        }, 100);
    });
  }
);
