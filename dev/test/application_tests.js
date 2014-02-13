
module.exports = (function() {
    var unit_tests = {};
    unit_tests.tests = [];
    unit_tests.Application = require('../js/application');

    unit_tests.tests.push(["pulled application", function() {
      expect(1);
      ok(unit_tests.Application, "it's here");
    }]);

    return unit_tests;
})();
