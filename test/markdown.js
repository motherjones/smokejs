/*global require */
var test = require('tape');
var markdown = require('../js/markdown');
var should = require('should');

describe("Markdown", function() {
  it("adds custom !! syntax to the lexer", function (done) {
    var md = '!![foobar]';
    var tokens = markdown.lexer(md);
    tokens.should.have.property(0);
    var token = tokens[0];
    token.should.have.property('type', 'component_block');
    token.should.have.property('slug', 'foobar')
    done();
  });
  it("verify parser handles component type in lexer", function(done){
    var md = '!![barfoo]';
    var html = markdown.toHTML(md);
    html.should.equal('{#load  slug="barfoo" }');
    done();
  });
});
