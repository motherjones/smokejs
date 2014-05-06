/*global require */

var test = require('tape');
var markdown = require('../js/markdown');
test("verify inline component blocks make it into lexer",
  function(t) {
    t.plan(2);
    var md = '!![foobar]';
    var tokens = markdown.lexer(md);
    t.equal(
      tokens[0]['type'], 'component_block',
      'adds a component type to the lexer'
    );
    t.equal(
      tokens[0]['slug'], 'foobar',
      'the correct slug gets into the lexer'
    );
    t.end();
  }
);
test("verify parser handles component type in lexer",
  function(t) {
    t.plan(1);
    var md = '!![barfoo]';
    var html = markdown.toHTML(md); 
    t.equal(
      html, 'barfoo',
      'the proper component is rendered' 
    );
    t.end();
  }
);

