/*global require */

module.exports = (function() {
    var unit_tests = {};
    unit_tests.tests = [];
    unit_tests.HiveMind = require('../js/hivemind');

    unit_tests.tests.push(["pulled hivemind", function() {
      expect(1);
      ok(unit_tests.HiveMind, "it's here");
    }]);

    return unit_tests;
})();
