/*global require */

var testCollections = [
  require('./basic_tests'),
  require('./hivemind_tests'),
//  require('./story_tests'),
  require('./ad_tests')
];

for (var i = 0; i < testCollections.length; i++){
  var testCollection = testCollections[i];
  for (var k = 0; k < testCollection.tests.length; k++) {
    var tests = testCollection.tests[k];
    test(
        tests[0],
        tests[1]
    );
  }

  for (var k = 0; k < testCollection.asyncTests.length; k++) {
      var asyncTests = testCollection.asyncTests[k];
      asyncTest(
          asyncTests[0],
          asyncTests[1]
      );
  }
}
