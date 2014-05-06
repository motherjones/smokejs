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

test("test ad creation",
  function(t) {
    t.plan(3);

    var dustBase = render.dustBase();
    var chunk = new Chunk();
    t.ok(dustBase, 'dust base created');


    $.when(dustBase.global.ad(chunk, {}, {}, {placement: 'test'}))
      .then(function() {
          t.equal( chunk.output, 
            '<iframe class="ads" data-placement="test" id="ad_test"data-resizable="resizable"scrolling="no" frameborder="0"sandbox="allow-scripts allow-same-origin"src="http://mj-tech.s3.amazonaws.com/ad_w_intersitial.html#placement=test&amp;groupid=unset&amp;key=unset&amp;height=0&amp;uri=/__testling"seamless></iframe>',
            'ads rendered correctly'
          );
      });

    t.equal( chunk.promise.state(), 'resolved',
      'chunk properly sets promise'
    );

  }
);


    /*
    strictEqual(
      view,
      unit_tests.Ad.CurrentAds['test_pos'],
      'making an ad puts it in the list of current ads'
    );
    strictEqual(
      model.get('src'),
      unit_tests.EnvConfig.AD_LOCATION +
        '#placement=test_pos&groupid=&key=&height=&uri=' +
        window.location.pathname,
      'making an ad sets the model\'s src'
    );
    strictEqual(
      model.get('slug'),
      'ad_test_pos',
      'ads have slugs as long as they have placements'
    );

    model.set('key', 'testKeyword');
    model.set('groupid', '0101');
    view.trigger('pagechange');
    strictEqual(
      model.get('src'),
      unit_tests.EnvConfig.AD_LOCATION +
        '#placement=test_pos&groupid=0101&key=testKeyword&height=&uri=' +
        window.location.pathname,
      'triggering the pagechange event recalculates the iframe src'
    );

  }
);



*/
