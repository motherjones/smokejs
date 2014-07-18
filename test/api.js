/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var secondResponse = require('./fixtures/article/2.json');
var utils = require('./utils');
var should = require('should');
var _ = require('lodash');

describe("component api", function() {
  describe("constructor", function() {
    it("builds if data given to it", function(done) {
      var component = new api.Component('test', response);
      component.slug.should.eql(response.slug);
      component.metadata.should.have.keys(_.keys(response.metadata));
      done();
    });
    it("keeps object boundries", function(done) {
      var drones = new api.Component('drones', response);
      var iceStore = new api.Component('ice', secondResponse);
      drones.slug.should.not.eql(iceStore.slug);
      drones.attributes.should.not.eql(iceStore.attributes);
      drones.metadata.should.not.eql(iceStore.metadata);
      done();
    });
  });
  describe("get", function() {
    var server;
    var slug;
    before(function(done) {
      slug = 'test';
      server = utils.mock_component(slug, response);
      done();
    });
    after(function(done) {
      server.restore();
      done();
    });
    it("returns data from mirrors", function(done) {
      var callback = function(data) {
        should.exist(data);
        data.should.have.property('slug', slug);
      };
      var component = new api.Component(slug);
      component.get(callback).then(function() {
        should(component).have.property('metadata');
        should(component).have.property('attributes');
        should(component).have.property('data');
        done();
      });
    });
  });
});


describe("data api", function() {
  describe("get", function() {
    it("returns data from mirrors", function(done) {
      var slug = 'test';
      var server = utils.mock_component(slug, {}, {
        'content-type': 'text/x-markdown',
        'response': 'DATA'
      });
      var callback = function(data) {
        server.restore();
        should.exist(data);
        data.should.be.exactly('DATA');
      };
      var data_uri = '/mirrors/component/' + slug +'/data';
      var data = new api.Data(data_uri);
      data.get(callback).then(function() {
        done();
      });
    });
    it("should redirect to mirrors when unauthorized", function(done) {
      var slug = 'unauthorized_check';
      server = utils.mock_unauthorized(slug);
      var component = new api.Component(slug);
        //overwrite function that changes document location
      var redirect = api.logInRedirect;
      api.logInRedirect = function() {
        true.should.be.ok;
        done();
      };
      component.get();
    });
  });
});
