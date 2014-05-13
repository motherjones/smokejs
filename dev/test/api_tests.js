/*global require */
var $ = require('jquery');
var API = require('../js/api');
var test = require('tape');
var response = require('./fixtures/article/1.json');

test("test component api", function(t) {
  t.plan(2);
  var slug = 'test';
  var server = sinon.fakeServer.create();
  server.respondWith('GET', '/mirrors/component/'+slug, [200,
    { "Content-Type": "application/json" },
    JSON.stringify(response)
  ]);
  server.autoRespond = true;
  var callback = function(data) {
    t.ok(data, 'data is returned');
    t.equal(data['slug'], slug, 'slug is returned');
    t.end();
  };
  var promise = API.load(slug, callback); 
});
