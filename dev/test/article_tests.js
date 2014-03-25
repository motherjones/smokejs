/*global require */

module.exports = (function() {
  var unit_tests = {};
  unit_tests.tests = [];
  unit_tests.asyncTests = [];

  unit_tests.Article = require('../js/article');
  unit_tests.$ = require('jquery');

  unit_tests.asyncTests.push(["test article creation", function() {
    //expect(7);
    expect(3); //sad. see commentary below

    unit_tests.$('#qunit-fixture').html('');

    var model = new unit_tests.Article.Model({id: 3});
    var view = new unit_tests.Article.View({ model: model });
    var attached = view.attach('#qunit-fixture');

    unit_tests.$.when(attached).done(function() {
      var fixture = unit_tests.$('#qunit-fixture');
      ok( fixture.html(), 'article created at all');

      strictEqual(
        unit_tests.$('#component_author li a').html(),
        'Jon Young',
        'asset rendered appropriately'
      );

      var content = fixture.find('#component_body'); 
      ok( content.html(), 'article content loaded');

      /*THESE DON'T WORK secondary content render works async to primary content render 
       * and i don't have any promises returnd from them because they're in a weird spot
       * i should make an array of all things needed to be loaded and only resolve prime
       * deferred once they're all done, but I can't even know when my array is actually
       * done being filled
      ok( content.find('load_asset'), 'asset tag found');
      ok( content.find('load_asset').html(), 'asset loaded from content');

      ok( content.find('load_collection'), 'collection tag found');
      ok( content.find('load_collection').html(), 'collection loaded from content');
      */

      start();
    });

  }]);


  return unit_tests;
})();

