export.display_main_content = function(schema, slug, callback) {
  API.load('/mirrors/component/' + slug, function(data) {
    render(schema, data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
    });
  });
};

export.display_homepage = function(callback) {
  API.load('/homepage', function(data) {
    render('homepage', data, function(html) {
      $('body').html(html);
      Ad.reload(data.keywords);
      callback();
    });
  });
};
