/*global require */
var views = require('../js/edit_views');
var view_views = require('../js/views');
var editor = require('../js/editor');
var utils = require('./utils');
var response_peter = require('./fixtures/author/peter.json');
var response_homepage = require('./fixtures/homepage.json');
var should = require('should');

var match_mock = {
  fn : function() {}, params: {}, next: function(){
    return match_mock;
  }
};

describe("edit views", function() {
  describe('displayMainContent', function() {
    var self = {};
    beforeEach(function() {
      self.match = match_mock;
      self.match.params.slug = 'peter';
      self.match.params.schema = 'author';
      self.match.component = response_peter;
      self.server = utils.mock_component(self.match.params.slug, response_peter);
    });
    afterEach(function() {
      editor.makeEditable.restore();
      editor.socialSharingElement.restore();
      self.server.restore();
      self = {};
    });
    it('display main content', function (done) {
      sinon.stub(editor, "makeEditable");
      sinon.stub(editor, "socialSharingElement");
      views.displayMainContent(self.match, function(match, html, title) {
        should.exist(match);
        should.not.exist(html);
        should.not.exist(title);
        editor.makeEditable.called.should.be.true;
        editor.socialSharingElement.called.should.be.true;
        done();
      })
    });
  });
  describe('homepage', function() {
    var self = {};
    beforeEach(function() {
      self.match = match_mock;
      self.server = utils.mock_component('homepage', response_homepage);
    });
    afterEach(function() {
      self.server.restore();
      self = {};
    });
    it("should display and set title", function(done) {
      views.displayHomepage(self.match, function(match, html, title) {
        should.exist(match);
        should.not.exist(html);
        should.not.exist(title);
        done();
      })
    });
  });
});

