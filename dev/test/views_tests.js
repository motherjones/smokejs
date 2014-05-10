/*global require */

var test = require('tape');
var views = require('../js/views');
var EnvConfig = require('../js/config');

var match_mock = { params: {} };
test( "test display_main_content", function(t) {
  t.plan(3);
  var match = match_mock;
  match.params.slug = 'peter-van-buren';
  match.params.schema = 'author';

  var promise = views.display_main_content(match, function(data, html) {
    t.equal( html, //FIXME we maybe should get twittername into our fixtures 
      '<div class="author"> <h1>Peter Van Buren</h1> @ </div> <section id="component_body"> <b>Data url</b>: ' +
      EnvConfig.DATA_STORE + 'component/peter-van-buren </section> ', //FIXME note that this assumes we can't pull markdonw yet
      'display main content has a callback which provides the html'
    );
    t.equal( data.content_type, "application/json",
      'display main content has a callback which provides the data of the object loaded'
    );
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

  var promise = views.display_main_content(match, function(data) { //(data, html)
    /* uhhh. get the actual html offa the server
    t.equal( html, //FIXME we maybe should get twittername into our fixtures 
      '<div class="author"> <h1>Peter Van Buren</h1> @ </div> <section id="component_body"> <b>Data url</b>: ' +
      EnvConfig.DATA_STORE + 'component/peter-van-buren </section> ', //FIXME note that this assumes we can't pull markdonw yet
      'display homepage has a callback which provides the html'
    );
    */
    t.equal( data.metadata.title, "Mother Jones Home Page",
      'display homepage has a callback which provides the data of the object loaded'
    );
  });

  t.equal(
    promise.state(),
    'pending',
    'display homepage returns a promise'
  );
});
