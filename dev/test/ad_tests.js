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
        '#placement=test&groupid=unset&key=unset&height=0&uri=' +
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
                '#placement=test&groupid=unset&key=unset&height=0&uri=' +
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
