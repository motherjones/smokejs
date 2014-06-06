/*global require */

var $ = require('jquery');
$.getScript('http://sinonjs.org/releases/sinon-server-1.10.2.js', function() {
  require('./api');
  require('./ad');
  require('./markdown');
  require('./render');
  require('./views');
  require('./router');
})
