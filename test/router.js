/*global require */
var router = require('../js/router');
var $ = require('jquery');
var Ad = require('../js/ad');
var should = require('should');


describe("router properties", function() {
  it('ad loaded', function(done) {
    should.exist(Ad);
    done();
  });
  it('router loaded', function(done) {
    should.exist(router);
    router.should.have.property('match');
    done();
  });
  it("router pop calls callback", function(done) {
    var test_callback = function() {
      done();
    };
    router.addRoute("test", test_callback);
    router.pop('test');
  });
});


describe("router callbacks", function() {
  it('router starts w/ callback doing nothing', function(done) {
    should(router.callback()).eql(null, 'callback is not set');
    done();
  });

  beforeEach(function() {
    var match = {};
    match.fn = function() {};
    match.component = {
      metadata: {
        section: "politics extra",
      }
    }
    match.next = function() { return match };
    router.browserCallback(match, 'lolno', 'Title');
  });
  afterEach(function() {
    Ad.key = '';
  });
  it('callback sets the body html', function(done) {
    should($('body').html()).eql('lolno');
    done();
  });
  it('sets browser Ad callback and keys', function(done) {
    should.exist(Ad);
    Ad.should.have.property('key', 'politics-extra');
    done();
  });
  after(function() {
    window.history.back();
  });
  it("click event adds to history", function(done) {
    var current_history_length = history.length;
    var uri = "/loltest";
    router.addRoute(uri, function() {});
    var fakelink = $('<a href="#/loltest"></a>').click(router.browserClick);
    $('body').append(fakelink);
    var promise = fakelink.click();
    $.when(promise).done(function() {
      should(current_history_length + 1).eql(history.length);
      done();
    });
  });
});


describe("browserStart", function() {
  it("sets browserClick", function(done) {
    router.browserClick = function() {
      done();
    };
    router.pop = function() {
      var promise = new $.Deferred();
      promise.resolve();
      return promise;
    };
    router.browserStart();
    should(router.browserCallback).eql(
      router.callback, 'sets router.callback to browserCallback');
    var fakelink = $('<a href="/loltest" id="fakelink"></a>');
    $('body').append(fakelink);
    $('#fakelink').click();
  });
});
