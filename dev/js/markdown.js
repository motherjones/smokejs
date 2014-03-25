/*global require */
'use strict';

module.exports = (function() {
  var marked = require('marked');
  /* Prototype on top of marked here, please */

  return {
    toHTML: marked,
    lexer: marked.lexer,
    parser: marked.parser
  };

})();
