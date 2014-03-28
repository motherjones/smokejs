/*global module */
'use strict';

module.exports = (function() {
  var HiveMind = require('./hivemind');
  var Article = require('./article');

  HiveMind.possibleAssets['article'] = Article;

  return Article;

})();
