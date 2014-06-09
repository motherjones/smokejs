/*global require */
var $ = require('jquery');
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');

test("test component api", function(t) {
  t.plan(3);
  if ( typeof(Storage)!=="undefined" ) {
    localStorage.clear()
  }
  var slug = 'test';
  var server = utils.mock_component(slug, response);
  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
    //cleanup
    if ( typeof(Storage)!=="undefined" ) {
      localStorage.removeItem(slug);
    }
    server.restore();
  };
  var promise = api.component(slug, callback);
  promise.then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.end();
  });
});

test("test component api's use of localstorage", function(t) {
  t.plan(2);
  var localSlug = 'localtest';
  var localResponse = '{"string" : "test local data"}';
  localStorage.setItem(localSlug, localResponse);
  var localResponse = JSON.parse(localResponse);
  var promise = api.component(localSlug, function(response) { 
    t.equal(response.string, localResponse.string, 'component pulls from localstorage');
  });//pulls from local are sync, thank goodness

  //cleanup
  if ( typeof(Storage)!=="undefined" ) {
    localStorage.removeItem(localSlug);
  }

  promise.then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.end();
  });
});

