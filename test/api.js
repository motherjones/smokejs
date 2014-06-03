/*global require */
var $ = require('jquery');
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var sinon = require('sinon');

test("test component api", function(t) {
  t.plan(3);
  var slug = 'test';
  var server = utils.mock_component(slug, response);
  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
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
  var localResponse = 'test local data';
  localStorage.setItem(localSlug, localResponse);
  var promise = api.component(localSlug, function(response) { 
    t.equal(response, localResponse, 'component pulls from localstorage');
  });//pulls from local are sync, thank goodness
  promise.then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.end();
  });
});
