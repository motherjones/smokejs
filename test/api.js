/*global require */
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');

var cleanup = function() {
  if ( typeof(Storage)!=="undefined" ) {
    localStorage.clear();
  }
};
cleanup();

test("test component api", function(t) {
  t.plan(4);
  var slug = 'test';
  var server = utils.mock_component(slug, response);

  var component = new api.Component(slug);

  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
  };

  component.get(callback).then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.deepEqual(component.attributes, response.attributes, 'get sets attributes');
    server.restore();
    cleanup();
    t.end();
  });
});

test("test component api's use of localstorage", function(t) {
  t.plan(2);
  var slug = 'localtest';

  var localResponse = '{"string" : "test local data", '
    + '"lastUpdated" : ' + new Date().getTime() + ' }';
  localStorage.setItem(slug, localResponse);

  var testResponse = JSON.parse(localResponse);

  var component = new api.Component(slug)
  component.get(function(response) { 
    t.equal(response.string, testResponse.string, 'component pulls from localstorage');
  }).then(function() {
    t.ok( true, 'promise is resolved as expected');
    cleanup();
    t.end();
  });

});

test("test component api's check to see if localstorage is stale", function(t) {
  t.plan(3);
  var slug = 'test';
  var server = utils.mock_component(slug, response);
  var localResponse = '{"string" : "test local data", "lastUpdated" : 0 }';
  localStorage.setItem(slug, localResponse);

  var component = new api.Component(slug);
  component.get(function(data) { 
    t.deepEqual(response.metadata, data.metadata, 'component pulls from server, not local');
  }).then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.deepEqual(component.metadata, response.metadata, 'get sets metadata');
    cleanup();
    t.end();
  });

});
