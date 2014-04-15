#!/usr/bin/env node

var express = require('express');
var path = require('path');

var app = express();
console.log(__dirname);
console.log( path.join(__dirname, 'build', 'css'))
app.use('/css', express.static(path.join(__dirname, 'build', 'css')));
app.use('/js', express.static(path.join(__dirname, 'build', 'js')));
app.use(function(req, res) {
  res.sendfile(path.join(__dirname, 'build/index.html'));
});
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on post ' + app.get('port'));
});
