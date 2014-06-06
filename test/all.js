/*global require */

var $ = require('jquery');
$.getScript('libs/sinon.js', function() {
  require('./api');
  require('./ad');
  require('./markdown');
  require('./render');
  require('./views');
  require('./router');
})
