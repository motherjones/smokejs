/*global require */

module.exports = (function() {
  var unit_tests = {};
  unit_tests.tests = [];
  unit_tests.asyncTests = [];

  unit_tests.markdown = require('../js/markdown');

  unit_tests.tests.push(
    ["verify inline component blocks make it into lexer",
      function() {
        expect(2);
        var md = '!![foobar]';
        var tokens = unit_tests.markdown.lexer(md);
        strictEqual(
          tokens[0]['type'], 'component_block',
          'adds a component type to the lexer'
        );
        strictEqual(
          tokens[0]['slug'], 'foobar',
          'the correct slug gets into the lexer'
        );
      }
    ]
  );

  unit_tests.tests.push(
    ["verify parser handles component type in lexer",
      function() {
        expect(1);
        var md = '!![barfoo]';
        var html = unit_tests.markdown.toHTML(md); 
        strictEqual(
          html, 'barfoo',
          'the proper component is rendered' 
          //current render just passes through
        );
      }
    ]
  );

  return unit_tests;
})();
