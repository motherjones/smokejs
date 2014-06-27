var api = require('./edit_api');
var render = require('./render');

// REWRITE ALL OF THESE TO SHOW THE EDIT TEMPLATES NOT THE NORMAL ONES
exports.display_main_content = function(match, callback) {
  var component = new api.Component(match.params.slug);
  return component.get(function(data) {
    render.render(match.params.schema, data, function(html) {
      if (callback) { callback(data, html); }
    });
  });
};

exports.display_homepage = function(callback) {
  var component = new api.Component('homepage');
  return component.get(function(data) {
    render.render('homepage', data, function(html) {
      if (callback) { callback(data, html); }
    });
  });
};
