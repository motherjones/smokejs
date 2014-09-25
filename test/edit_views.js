/*global require */
var views = require('../js/edit_views');
var editor = require('../js/editor');
var utils = require('./utils');
var response_peter = require('./fixtures/author/peter.json');
var response_homepage = require('./fixtures/homepage.json');
var match_mock = { params: {} };
var should = require('should');

describe("edit views", function() {
  it('should display main content', function (done) {
    var match = match_mock;
    match.params.slug = 'peter';
    match.params.schema = 'author';
    var server = utils.mock_component(match.params.slug, response_peter);

    views.displayMainContent(match, function(data, html) {
      should(data.content_type).eql("text/x-markdown",
        'display main content has a callback which provides the data of the object loaded'
      );
      server.restore();
    }).then(function() {
      done();
    });
  });
  it('should calll make editable on main content', function (done) {
    var match = match_mock;
    var socialSharingString = 'social call';
    match.params.slug = 'peter';
    match.params.schema = 'author';
    var server = utils.mock_component(match.params.slug, response_peter);
    var makeEditable = sinon.stub(editor, "makeEditable", function(){
      console.log('called');
      should(makeEditable.called).be.true;
      done();
    });
    var socialSharing = sinon.stub(editor, "socialSharingElement", function(){
      return socialSharingString;
    });

    views.displayMainContent(match, function(data, html) {
      console.log('socail string check here');
      should(html.indexOf(socialSharingString) >= 0).be.true;
      console.log('socail string found');
    }).then(function() {
      should(socialSharing.called).be.true;
      console.log('social string func caled');
    });
  });
  after(function(done) {
    editor.makeEditable.restore();
    editor.socialSharingElement.restore();
    done();
  });
  it( "should display the homepage", function(done) {
    var server = utils.mock_component('homepage', response_homepage);
    views.displayHomepage(function(data, html) {
      should( data.metadata.title ).eql( "Mother Jones Home Page",
        'display homepage has a callback which provides the data of the object loaded'
      );
      server.restore();
    }).then(function() {
      done();
    });
  });
});

