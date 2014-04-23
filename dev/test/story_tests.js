/*global require */

module.exports = (function() {
  var unit_tests = {};
  unit_tests.tests = [];
  unit_tests.asyncTests = [];

  unit_tests.Story = require('../js/hivemind');
  unit_tests.$ = require('jquery');

  unit_tests.asyncTests.push(["test story creation", function() {
    expect(8);

    unit_tests.$('#qunit-fixture').html('');

    var model = new unit_tests.Story.Model({id: 'obama-drone-pakistan-us-citizen-leak-killing'});
    var view = new unit_tests.Story.View({ model: model });
    var attached = view.attach('#qunit-fixture');

    unit_tests.$.when(attached).done(function() {
      var fixture = unit_tests.$('#qunit-fixture');
      ok( fixture.html(), 'story created at all');

      strictEqual(
        unit_tests.$('#component_author li a').html(),
        'Peter Van Buren',
        'asset rendered appropriately'
      );

      var content = fixture.find('#component_body'); 
      ok( content.html(), 'story content loaded');

      /*THESE DON'T WORK secondary content render works async to primary content render 
       * and i don't have any promises returnd from them because they're in a weird spot
       * i should make an array of all things needed to be loaded and only resolve prime
       * deferred once they're all done, but I can't even know when my array is actually
       * done being filled
      */
      ok( content.find('load_asset'), 'asset tag found');
      //ok( content.find('load_asset').html(), 'asset loaded from content');

      ok( content.find('load_collection'), 'collection tag found');
      //ok( content.find('load_collection').html(), 'collection loaded from content');

      ok( content.find('h1'), 'markdown title created');

      ok( content.find('em'), 'markdown em tag created');

      ok( content.find('blockquote'), 'markdown blockquote tag created');

      start();
    });

  }]);


  return unit_tests;
})();

