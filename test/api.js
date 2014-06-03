/*global require */
var $ = require('jquery');
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');

test("test component api", function(t) {
  t.plan(2);
  var slug = 'test';
  var server = utils.mock_component(slug, response);
  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
    server.restore();
    t.end();
  };
  var promise = api.component(slug, callback);
  $.when(promise).done(function() {
    //maybe a test here?
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
  t.equal( promise.state(), 'resolved', 'promise is resolved as expected');
  setTimeout(function() {
    t.end()
  }, 100);
});
