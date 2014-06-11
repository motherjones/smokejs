/*global require */
var api = require('../js/edit_api');
var test = require('tape');
var test_data = require('./fixtures/article/1.json');
var utils = require('./utils');

describe("edit component api", function() {
  describe("post", function(done) {
    it("makes post requests at mirrors", function(done) {
      console.log('in make post request');
      var slug = 'testslug';
      console.log('set slug');
//      var server = utils.mock_component('fahdsaflkh', {"slug" : slug});
      console.log('created server');

      var callback = function(data) {
        console.log('about to reset server in post');
 //       server.restore();
        console.log('server is restored');
        //data.should.have.property('slug', slug);
      };

      console.log('defined callback');

      var component = new api.Component();
      console.log('made new component object');
      component.create(callback).then(function() {
        component.slug.should.eql(slug);
        done();
      });
    });
  });

  describe("patch", function(done) {
    it("makes patch requests at mirrors", function(done) {
      var slug = 'testslug';
      var server = utils.mock_component(slug, test_data);

      var component = new api.Component(slug);
      component.metadata = test_data.metadata;
      component.attributes = test_data.attributes;
      component.update(function(response) { 
        console.log('about to reset server');
        server.restore();
        response.eql(test_data, 'patch gets its data back as a response');
      }).then(function() {
        true.should.be.true('promise is resolved as expected');
        done();
      });
    });
  });
});
