export.display_main_content = function(schema, slug, callback) {
  var promise = new $.Deferred();
  API.load('/mirrors/component/' + slug, function(data) {
    render(schema, data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
      promise.resove();
    });
  });
  return promise;
};

export.display_homepage = function(callback) {
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
