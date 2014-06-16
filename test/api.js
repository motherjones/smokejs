/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

describe("component api", function() {
  describe("get", function() {
    it("get returns data from mirrors", function(done) {
      var slug = 'test';
      var server = utils.mock_component(slug, response);
      var callback = function(data) {
        server.restore();
        should.exist(data);
        data.should.have.property('slug', slug);
      };
      var component = new api.Component(slug);
      component.get(callback).then(function() {
        should(component).have.property('metadata');
        should(component).have.property('attributes');
        done();
      });
    });
    it("get returns data from localstorage", function(done) {
      var slug = 'localtest';
      var localResponse = '{"string" : "test local data", ' +
        '"lastUpdated" : ' + new Date().getTime() + ' }';
      localStorage.setItem(slug, localResponse);

      var testResponse = JSON.parse(localResponse);

      var component = new api.Component(slug);
      component.get(function(response) {
        response.should.have.property('string', testResponse.string);
      }).then(function() {
        done();
      });
    });
    it("calls out to mirrors if localstorage is stale", function(done) {
      var slug = 'test';
      var server = utils.mock_component(slug, response);
      var localResponse = '{"string" : "test local data", "lastUpdated" : 0 }';
      localStorage.setItem(slug, localResponse);

      var component = new api.Component(slug);
      component.get(function(data) {
        response.should.have.property('metadata', data.metadata);
      }).then(function() {
        component.should.have.property('metadata', response.metadata);
        server.restore();
        done();
      });
    });
  });
});
