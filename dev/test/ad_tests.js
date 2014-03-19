/*global require, window */

module.exports = (function() {
  var unit_tests = {};
  unit_tests.tests = [];

  unit_tests.Ad = require('../js/ad');
  unit_tests.EnvConfig = require('../js/config');
  unit_tests.$ = require('jquery');

  unit_tests.tests.push(["pulled libs", function() {
    expect(5);
      ok(unit_tests.Ad, "ad lib is here");
      ok(unit_tests.Ad.Model, "ad lib has models");
      ok(unit_tests.Ad.View, "ad lib has views");
      ok(unit_tests.Ad.CurrentAds, "ad lib has storage to retain which ads exist");
      ok(unit_tests.EnvConfig, "env config is here");
  }]);

  unit_tests.tests.push(
    ["test model creation",
      function() {
        expect(2);
        var model = new unit_tests.Ad.Model();
        strictEqual(
          model.get('template'),
          'ad_iframe',
          'Default ad template is "ad_iframe"'
        );
        strictEqual(
          model.load().state(), 
          'resolved',
          'ads are always say they\'re loaded, as there\'s nothing to load'
        );
      }
    ]
  );

  unit_tests.tests.push(
    ["test view creation",
      function() {
        expect(4);
        var model = new unit_tests.Ad.Model();
        model.set('placement', 'test_pos');
        var view = new unit_tests.Ad.View({ model: model });

        strictEqual(
          view,
          unit_tests.Ad.CurrentAds['test_pos'],
          'making an ad puts it in the list of current ads'
        );
        strictEqual(
          model.get('src'),
          unit_tests.EnvConfig.AD_LOCATION +
            '#placement=test_pos&groupid=&key=&height=&uri=' +
            window.location.pathname,
          'making an ad sets the model\'s src'
        );
        strictEqual(
          model.get('slug'),
          'ad_test_pos',
          'ads have slugs as long as they have placements'
        );

        model.set('key', 'testKeyword');
        model.set('groupid', '0101');
        view.trigger('pagechange');
        strictEqual(
          model.get('src'),
          unit_tests.EnvConfig.AD_LOCATION +
            '#placement=test_pos&groupid=0101&key=testKeyword&height=&uri=' +
            window.location.pathname,
          'triggering the pagechange event recalculates the iframe src'
        );

      }
    ]
  );



  return unit_tests;
})();
