/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var secondResponse = require('./fixtures/article/2.json');
var utils = require('./utils');
var should = require('should');
var _ = require('lodash');
var sinon = require('sinon');
var EnvConfig = require('../js/config');

describe("api utilities", function() {
  describe("_success", function() {
    var self;
    beforeEach(function() {
      self = {};
      self.resolve = sinon.spy();
      self.reject = sinon.spy();
      self.callback = sinon.spy();
      self.redirect = sinon.stub(api, "logInRedirect");
      self.success = api._success(self.resolve,
        self.reject, self.callback);
    });
    afterEach(function() {
      self.redirect.restore();
    });
    it("returns a function", function(){
      self.success.should.be.a.Function;
    });
    it("statusText OK callback success", function(){
      var result = { statusCode: 200 };
      self.success('', result, '');
      self.callback.should.have.property('calledOnce', true);
      self.resolve.should.have.property('calledOnce', true);
      self.reject.should.have.property('called', false);
    });
    it("statusText OK callback fail", function(){
      self.callback = sinon.spy(function() {
        throw new Error("test");
      });
      self.success = api._success(self.resolve,
        self.reject, self.callback);
      var result = { statusCode: 200 };
      self.success('', result, '');
      self.callback.should.have.property('calledOnce', true);
      self.reject.should.have.property('calledOnce', true);
      self.resolve.should.have.property('called', false);
    });
    it("statusText Unauthorized", function(){
      self.success = api._success(self.resolve,
        self.reject, self.callback);
      var result = { statusCode: 401 };
      self.success('', result, '');
      self.callback.should.have.property('called', false);
      self.reject.should.have.property('called', false);
      self.resolve.should.have.property('called', false);
      self.redirect.should.have.property('calledOnce', true);
    });
    it("statusText 500", function(){
      self.success = api._success(self.resolve,
        self.reject, self.callback);
      var result = { statusText: 500 };
      self.success('', result, '');
      self.callback.should.have.property('called', false);
      self.reject.should.have.property('calledOnce', true);
      self.resolve.should.have.property('called', false);
      self.redirect.should.have.property('called', false);
    });
  });
  describe("_promise_request", function() {
    var slug, server;
    it("calls onRejected when request fails", function(done) {
      var url = EnvConfig.MIRRORS_URL + 'test/';
      var callback = sinon.spy();
      var success = sinon.spy();
      var fail = function() {
        callback.should.have.property('called', false);
        success.should.have.property('called', false);
        done();
      };
      api._promise_request({
        'url': url,
        'timeout': 1
        }, callback).then(success, fail);
    });
    before(function(done) {
      slug = 'test';
      server = utils.mock_component(slug, response);
      done();
    });
    after(function(done) {
      server.restore();
      done();
    });
    it("callback runs before promise succeeds", function(done) {
      var url = EnvConfig.MIRRORS_URL + 'component/' + slug + '/';
      var callback = sinon.spy();
      var fail = sinon.spy();
      var success = function() {
        callback.should.have.property('calledOnce', true);
        callback.calledWithExactly(response);
        fail.should.have.property('called', false);
        done();
      };
      api._promise_request(url, callback).then(success, fail);
    });
  });
});

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
      var callback = sinon.spy();
      //var data_uri = '/mirrors/component/' + slug +'/data/';
      var data = new api.Data(slug);
      data.should.have.property('uri');
      data.get(callback).then(function() {
        callback.should.have.property('calledOnce', true);
        callback.calledWithExactly(data).should.eql(true);
        server.restore();
        done();
      });
    });
    it("should redirect to mirrors when unauthorized", function(done) {
      var slug = 'unauthorized_check';
      var server = utils.mock_unauthorized(slug);
      var component = new api.Component(slug);
        //overwrite function that changes document location
      var redirect = api.logInRedirect;
      api.logInRedirect = function() {
        true.should.be.ok;
        api.logInRedirect = redirect;
        server.restore();
        done();
      };
      component.get();
    });
  });
});
