'use strict';

var marked = exports.toHTML = require('marked');

exports.renderer = new marked.Renderer();
exports.renderer.component_block = function (that) {
  var str = '{#load  slug="' + that.token.slug + '" }';
  return str;
};

var options = {
  'renderer': exports.renderer,
  'extra_block_rules': {
    //Looks for pattern !!() we can switch to !!()[args] later
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

exports.lexer =  function (md) {
  return marked.lexer(md, options);
};

exports.parser = marked.parser;
