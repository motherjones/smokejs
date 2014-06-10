/*global require */
var $ = require('jquery');
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

describe("component api", function() {
  describe("get", function() {
    it("returns data with slug", function(done) {
      var slug = 'test';
      var server = utils.mock_component(slug, response);
      var callback = function(data) {
        should.exist(data, 'data is returned');
        should(data).have.property('slug', slug);
        done();
      };
      var promise = api.component(slug, callback);
      server.restore();
    });
  })
});
/*
test("test component api's use of localstorage", function(t) {
  var localSlug = 'localtest';
  var localResponse = 'test local data';
  localStorage.setItem(localSlug, localResponse);
  var promise = api.component(localSlug, function(response) {
    t.equal(response, localResponse, 'component pulls from localstorage');
    t.end();
  });//pulls from local are sync, thank goodness
  t.equal( promise.state(), 'resolved', 'promise is resolved as expected');
  setTimeout(function() {
    t.end()
  }, 100);
});
*/
