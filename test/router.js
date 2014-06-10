/*global require */
var test = require('tape');
var router = require('../js/router');
var $ = require('jquery');
var Ad = require('../js/ad');

describe("Ads", function() {
  it('ad loaded', function(done) {
    should.exist(Ad);
    done();
  });
  it('router loaded', function(d) {
    should.exist(router);
    router.should.have.property('match');
    done();
  });
  it("router pop calls callback", function() {
    var test_callback = function() {
      done();
    };
    router.addRoute("test", test_callback);
    router.pop('test');
  });
});



test( "test router callbacks", function(t) {
  t.equal(null, router.callback(),
    'router starts w/ callback doing nothing'
  );
  router.browserCallback({ keywords: 'keyword teststring' }, 'lolno');
  t.equal( $('body').html(), 'lolno',
    'Browser callback sets the body html'
  );
  t.ok(Ad, 'ad lib loaded');
  t.equal(Ad.key, 'keyword teststring', 'browser callback sets ad keywords');
  Ad.key = '';
  window.history.pushState(0, 0, location.pathname); //TODO: Figure out why this is required.
  var current_history_length = history.length;
  router.addRoute("/loltest", function() {});
  var fakelink = $('<a href="#/loltest"></a>').click(router.browserClick);
  var promise = fakelink.click();
  var oldLocation = location.pathname;
  $.when(promise).done(function() {
    t.equal(history.length, current_history_length + 1,
      'click event ads to history'
    );
    t.equal('/loltest', location.pathname,
      'click event takes browser url to link'
    );
    window.history.back();
  });
});

test( "test switching to browser mode", function(t) {
  t.plan(4);
  router.browserClick = function() {
    t.ok(true, 'after runing browserStart, clicks on links in body run browserClick');
  };
  router.pop = function() {
    var promise = new $.Deferred();
    //FIXME running this pop should happen where we decide we're in a browser
    t.ok(true, 'starting browser mode runs pop');
    promise.resolve();
    return promise;
  };
  router.browserStart();
  t.deepEqual(router.browserCallback, router.callback,
    'browser start sets callback to browser specific callback'
  );
  var fakelink = $('<a href="#/loltest" id="fakelink"></a>');
  var body = $('body');
  t.ok(body, 'body found w/ jquery');
  body.append(fakelink);
  $('#fakelink')
    .click();
});
