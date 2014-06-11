/*global require */
var api = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

describe("component api", function() {
  describe("get", function() {
    it("get returns data from mirrors", function(done) {
      var slug = 'test';
      var server = utils.mock_component(slug, response);
      var callback = function(data) {
        console.log('about to restore server for get');
        server.restore();
        console.log('just restored server');
        should.exist(data, 'data is returned on get');
        //data.slug.should.eql('slug', 'returns the slug');
      };
      var component = new api.Component(slug);
      component.get(callback).then(function() {
        console.log('in after promise');
        should(component).have.property('metadata');
        console.log('tested one thing');
        should(component).have.property('attributes');
        console.log('tested two things');
        server.restore();
        done();
      });
    });
    it("get returns data from localstorage", function(done) {
      var slug = 'localtest';
      var localResponse = '{"string" : "test local data", '
        + '"lastUpdated" : ' + new Date().getTime() + ' }';
      localStorage.setItem(slug, localResponse);

      var testResponse = JSON.parse(localResponse);

      var component = new api.Component(slug)
      component.get(function(response) { 
        response.string.should.eql(testResponse.string, 'component pulls from localstorage');
      }).then(function() {
        should.ok('promise is resolved as expected');
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
        response.metadata.should.eql(data.metadata, 'component pulls from server, not local');
      }).then(function() {
        should.ok('promise is resolved as expected');
        component.metadata.should.eql(response.metadata, 'get sets metadata');
        done();
      });
    });
  })
});
