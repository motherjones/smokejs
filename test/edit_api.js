/*global require */
var api = require('../js/edit_api');
var test_data = require('./fixtures/article/1.json');
var should = require('should');
var utils = require('./utils');
var sinon = require('sinon');

describe("edit component api", function() {
  describe("post", function() {
    it("makes post requests at mirrors", function(done) {
      var slug = 'testslug';
      utils.mock_component('test', {"slug" : slug}, false,
        ['byline', 'master_image']
      );

      var component = new api.Component();
      component.create().then(function() {
        should(true).be.ok;
        done();
      }, function() {
        true.should.not.be.ok;
        done();
      });
    });
  });

  describe("patch", function() {
    it("makes patch requests at mirrors", function(done) {
      var slug = 'testslug';
      var server = utils.mock_component(slug, test_data);

      var component = new api.Component(slug);
      component.metadata = test_data.metadata;
      component.attributes = test_data.attributes;
      component.update().then(function() {
        server.restore();
        done();
      });
    });
  });

  describe("setAttribute", function() {
    it("changes component attributes", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      var server = utils.mock_component(slug, {"slug" : slug}, false,
        ['test']
      );
      component.setAttribute('test', 'value').then(function() {
        should(component.attributes).have.property('test');
        should(component.attributes.test).eql('value');
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
      component.setAttribute('byline', 'value').then(function() {
        server.restore();
        done();
      });
    });
    it("attribute is changed but not created if not new", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      var server = sinon.fakeServer.create();
      server.respondWith('PUT', '/mirrors/component/'+slug+'/attribute/byline', [200,
        { "Content-Type": "application/json" },
        'note that its only put. posts do not work'
      ]);
      server.autoRespond = true;
      server.autoRespondAfter = 1;
      component.attributes.byline = 'previous value';
      component.setAttribute('byline', 'value').then(function() {
        server.restore();
        done();
      });
    });
  });

});
