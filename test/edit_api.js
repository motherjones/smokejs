/*global require */
var api = require('../js/edit_api');
var test = require('tape');
var test_data = require('./fixtures/article/1.json');
var utils = require('./utils');

test("test post api", function(t) {
  t.plan(3);
  console.log('okay');
  var server = utils.mock_component('', {"slug" : "testslug"});
  console.log('server up?');
  var callback = function(data) {
    console.log('post here');
    t.ok(data, 'data is returned');
    t.equal(data['slug'], 'testslug', 'a slug is returned on post');
    server.restore();
  };
  console.log('about to post');
  var promise = api.post(test_data, callback);
  console.log('called post');
  promise.then(function() {
    t.ok( true, 'promise is resolved as expected');
    t.end();
  });
});

test("test patch api", function(t) {
  t.plan(2);
  var slug = test_data.slug = 'testslug';
  var server = utils.mock_component(slug, test_data);
  var promise = api.patch(test_data, function(response) { 
    t.deepEqual(response, test_data, 'patch gets a response');
    server.restore();
  });//pulls from local are sync, thank goodness

  //cleanup
  promise.then(function() {
    t.ok( true, 'promise is resolved as expected');
    if ( typeof(Storage)!=="undefined" ) {
      localStorage.removeItem(localSlug);
    }
    t.end();
  });
});
