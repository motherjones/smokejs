/*global require */

var test = require('tape');
var views = require('../js/views');
var EnvConfig = require('../js/config');
var utils = require('./utils');
var response_peter = require('./fixtures/author/peter.json');
var response_homepage = require('./fixtures/homepage.json');

var match_mock = { params: {} };
test( "test display_main_content", function(t) {
  t.plan(2);
  var match = match_mock;
  match.params.slug = 'peter';
  match.params.schema = 'author';

  var server = utils.mock_component(match.params.slug, response_peter);
  var promise = views.display_main_content(match, function(data, html) {
    t.equal( data.content_type, "text/x-markdown",
      'display main content has a callback which provides the data of the object loaded'
    );
    server.restore();
    t.end();
  });

  t.equal(
    promise.state(),
    'pending',
    'display main content returns a promise'
  );
});

test( "test display_homepage", function(t) {
  t.plan(2);
  var match = match_mock;
  var server = utils.mock_component('homepage', response_homepage);
  var promise = views.display_homepage(function(data, html) {
    t.equal( data.metadata.title, "Mother Jones Home Page",
      'display homepage has a callback which provides the data of the object loaded'
    );
    t.end();
  });

  t.equal(
    promise.state(),
    'pending',
    'display homepage returns a promise'
  );
});
