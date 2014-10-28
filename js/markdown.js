'use strict';

var marked = require('marked');

/**
 * Sets up modifications to marked and sets them up to be called.
 * @module markdown
 */

/**
 * Use the markdown.renderer when modifying how markdown renders
 * see https://github.com/chjj/marked#overriding-renderer-methods
 */
exports.renderer = new marked.Renderer();

// Setup Custom Renderers.
exports.renderer.component_block = function (that) {
  var str = '{#load  slug="' + that.token.slug + '"/}';
  return str;
};

// Setup custom rules.
var options = {
  'renderer': exports.renderer,
  'extra_block_rules': {
    //Looks for pattern !![] we can switch to !!()[args] later
    component_block: /^!!\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]/
  },
  'extra_block_lexers': {
    component_block: function (cap) {
      return {
        type: 'component_block',
        slug: cap[1]
      };
    }
  }
};
marked.setOptions(options);

/**
 * Provides lexer access to marked with local modifications.
 * @param {string} markdown - Markdown string
 * @return {object} lexer -  List of tokens.
 */
exports.lexer =  function (md) {
  return marked.lexer(md, options);
};

/**
 * Converts markdown to html using local modifications.
 * @function
 * @param {string} markdown - Markdown string
 * @return {string} html - Html string
 */
exports.toHTML = marked;

/**
 * Coverts tokens to html using local modifications.
 * @function
 * @param {object} tokens - List of tokens from lexer.
 * @return {string} html - Html built from tokens.
 */
exports.parser = marked.parser;
