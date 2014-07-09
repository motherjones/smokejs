/*global require */
var api = require('../js/edit_api');
var router = require('../js/router');
var test_data = require('./fixtures/article/1.json');
var should = require('should');
var utils = require('./utils');
var sinon = require('sinon');

describe("edit component api", function() {
  describe("post", function() {
    var server = slug = undefined;
    before(function(done){
      slug = 'testslug';
      server = sinon.fakeServer.create();
      server.respondWith('POST', '/mirrors/component/', [200,
        { "Content-Type": "application/json" },
        ''
      ]);
      server.autoRespond = true;
      done();
    });
    it("makes post requests at mirrors", function(done) {
      var component = new api.Component();
      component.create().then(function() {
        done();
      }, function() {
        //this is the reject function, should not be here
        (1).should.eql(0, 'Post request rejected');
        done();
      });
    });
    after(function(done) {
      server.restore();
      done();
    });
  });

  describe("update", function() {
    var slug = server = undefined;
    before(function(done){
      slug = 'testslug';
      server = sinon.fakeServer.create();
      server.respondWith('PUT', '/mirrors/component/'+slug+'/', [200,
        { "Content-Type": "application/json" },
        ''
      ]);
      server.autoRespond = true;
      server.autoRespondAfter = 1;
      done();
    });
    it("makes put requests at mirrors", function(done) {
      var component = new api.Component(slug);
      component.metadata = test_data.metadata;
      component.attributes = test_data.attributes;
      component.update().then(function() {
        server.restore();
        done();
      }, function() {
        //this is the reject function, should not be here
        (1).should.eql(0, 'PUT request rejected');
        done();
      });
    });
    after(function(done) {
      server.restore();
      done();
    });
  });

  describe("setAttribute", function() {
    it("changes component attributes", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      var attr_name = 'test';
      var attr_value = 'value';
      var server = utils.mock_component_attributes(slug, [attr_name],
        {"slug" : slug}
      );
      component.setAttribute(attr_name, attr_value).then(function() {
        should(component.attributes[attr_name]).eql(attr_value);
        server.restore();
        done();
      });
    });
    it("creates new attributes if it is new", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      var server = sinon.fakeServer.create();
      server.respondWith('POST', '/mirrors/component/'+slug+'/attribute/', [200,
        { "Content-Type": "application/json" },
        'note that its only post. puts do not work'
      ]);
      server.autoRespond = true;
      server.autoRespondAfter = 1;
      should(component.attributes).not.have.property('attrName');
      component.setAttribute('attrName', 'attrValue').then(function() {
        should(component.attributes).have.property('attrName');
        server.restore();
        done();
      }, function() {
        //this is the reject function, should not be here
        (1).should.eql(0, 'POST request for attribute rejected');
        done();
      });
    });
    it("attribute is changed but not created if not new", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      var server = sinon.fakeServer.create();
      server.respondWith('PUT', '/mirrors/component/'+slug+'/attribute/byline/', [200,
        { "Content-Type": "application/json" },
        'note that its only put. posts do not work'
      ]);
      server.autoRespond = true;
      component.attributes.byline = 'previous value';
      component.setAttribute('byline', 'new value').then(function() {
        server.restore();
        done();
      }, function() {
        //this is the reject function, should not be here
        (1).should.eql(0, 'PUT request for attribute rejected');
        done();
      });
    });
  });

});
