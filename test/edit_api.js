/*global require */
var api = require('../js/edit_api');
var test_data = require('./fixtures/article/1.json');
var utils = require('./utils');

describe("edit component api", function() {
  describe("post", function() {
    it("makes post requests at mirrors", function(done) {
      var slug = 'testslug';
      var server = utils.mock_component('test', {"slug" : slug});
      var callback = function(data) {
        server.restore();
        data.should.have.property('slug', slug);
      };

      var component = new api.Component();
      component.create(callback).then(function() {
        component.should.have.property('slug', slug);
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
      component.update(function(response) { 
        server.restore();
        response.should.eql(test_data, 'patch gets its data back as a response');
      }).then(function() {
        done();
      });
    });
  });
});
