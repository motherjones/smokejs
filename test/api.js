/*global require */
var $ = require('jquery');
var API = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var sinon = require('sinon');

test("test component api", function(t) {
  t.plan(2);
  var slug = 'test';
  var server = sinon.fakeServer.create();
  utils.mock_component(slug, response);
  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
    server.restore();
    t.end();
  };
  var promise = API.load(slug, callback);
  $.when(promise).done(function() {
    //maybe a test here?
  });
});
