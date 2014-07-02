/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

describe("component api", function() {
  describe("get", function() {
    it("returns data from mirrors", function(done) {
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
  });
});


/*
describe("data api", function() {
  describe("get", function() {
    it("returns data from mirrors", function(done) {
      var slug = 'test';
      var server = utils.mock_component_data(slug, response);
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
  });
});
*/
