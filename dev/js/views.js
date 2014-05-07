export.display_main_content = function(match, callback) {
  var promise = new $.Deferred();
  API.load('/mirrors/component/' + match.params.slug, function(data) {
    render(match.params.schema, data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
      promise.resove();
    });
  });
  return promise;
};

export.display_homepage = function(match, callback) {
  var promise = new $.Deferred();
  API.load('/homepage', function(data) {
    render('homepage', data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
      promise.resove();
    });
  });
  return promise;
};
