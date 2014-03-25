  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

module.exports = (function() {
    var self = {};
    self.tests = [];
    self.asyncTests = [];

    self.tests.push(["truthy", function() {
      expect(3);
      ok(true, "true is truthy");
      equal(1, true, "1 is truthy and so equal");
      notEqual(0, true, "0 is NOT truthy");
    }]);
    self.tests.push(["deeptruth", function() {
        expect(1);
        deepEqual(1, 1, 'wow');
    }]);

    return self;
})();
