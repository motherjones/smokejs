/*global require */
var api = require('../js/edit_api');
var test_data = require('./fixtures/article/1.json');
var should = require('should');
var utils = require('./utils');

describe("edit component api", function() {
  describe("post", function() {
    it("makes post requests at mirrors", function(done) {
      var slug = 'testslug';
      var server = utils.mock_component('test', {"slug" : slug}, false,
        ['byline', 'master_image']
      );

      var component = new api.Component();
      component.create().then(function() {
        should(true).be.ok;
        done();
      }, function() {
        console.log('promise rejected');
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
        done();
      });
    });
  });

  describe("set", function() {
    it("changes component attributes", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.set('test', 'value');
      should(component).have.property('test');
      should(component.test).eql('value');
      done();
    });
    it("marks attribute as changed", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.set('test', 'value');
      should(component.changed).have.property('test');
      done();
    });
  });

  describe("setMetadata", function() {
    it("changes component metadata attributes", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.setMetadata('test', 'value');
      should(component.metadata).have.property('test');
      should(component.metadata.test).eql('value');
      done();
    });
    it("marks the metadata as changed", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.setMetadata('test', 'value');
      should(component.changed).have.property('metadata');
      done();
    });
  });

  describe("setAttribute", function() {
    it("changes component attributes", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.setAttribute('test', 'value');
      should(component.attributes).have.property('test');
      should(component.attributes.test).eql('value');
      done();
    });
    it("marks the attribute as changed", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.setAttribute('test', 'value');
      should(component.changedAttributes).have.property('test');
      done();
    });
    it("marks the attribute as created if new", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.setAttribute('test', 'value');
      should(component.createdAttributes).have.property('test');
      done();
    });
    it("attribute as changed but not created if not new", function(done) {
      var slug = 'testslug';
      var component = new api.Component(slug);
      component.attributes.test = 'previous value';
      component.setAttribute('test', 'value');
      should(component.changedAttributes).have.property('test');
      should(component.createdAttributes).not.have.property('test');
      done();
    });
  });

});
