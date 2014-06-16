/*global require */
var views = require('../js/views');
var utils = require('./utils');
var response_peter = require('./fixtures/author/peter.json');
var response_homepage = require('./fixtures/homepage.json');
var match_mock = { params: {} };
var should = require('should');

describe("Views", function() {
  it('should display main content', function (done) {
    var match = match_mock;
    match.params.slug = 'peter';
    match.params.schema = 'author';
    var server = utils.mock_component(match.params.slug, response_peter);

    views.display_main_content(match, function(data, html) {
      console.log(html);
      should(data.content_type).eql("text/x-markdown",
        'display main content has a callback which provides the data of the object loaded'
      );
      server.restore();
    }).then(function() {
      done();
    });
  });
  it( "should display the homepage", function(done) {
    var server = utils.mock_component('homepage', response_homepage);
    views.display_homepage(function(data, html) {
      console.log(html);
      should( data.metadata.title ).eql( "Mother Jones Home Page",
        'display homepage has a callback which provides the data of the object loaded'
      );
      server.restore();
    }).then(function() {
      done();
    });
  });
});
