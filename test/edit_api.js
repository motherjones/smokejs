/*global require */
var api = require('../js/edit_api');
var test = require('tape');
var test_data = require('./fixtures/article/1.json');
var utils = require('./utils');

var cleanup = function() {
  if ( typeof(Storage)!=="undefined" ) {
    localStorage.clear();
  }
};
cleanup();

test("test post api", function(t) {
  t.plan(4);
  var slug = 'testslug';
  var server = utils.mock_component('', {"slug" : slug});

  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'a slug is returned on post');
  };

  var component = new api.Component();
  component.create(callback).then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.equal(component.slug, slug, 'creation sets components slug');
    cleanup();
    server.restore();
    t.end();
  });
});

test("test patch api", function(t) {
  t.plan(2);
  var slug = 'testslug';
  var server = utils.mock_component(slug, test_data);

  var component = new api.Component(slug);
  component.metadata = test_data.metadata;
  component.attributes = test_data.attributes;
  component.update(function(response) { 
    t.deepEqual(response, test_data, 'patch gets a response');
  }).then(function() {
    t.ok( true, 'promise is resolved as expected');
    cleanup();
    server.restore();
    t.end();
  });
});
