/*global require */

var test_collections = [
    require('./basic_tests'),
    require('./application_tests'),
    require('./ad_tests')
];

for (var i = 0; i < test_collections.length; i++){
    var test_collection = test_collections[i];
    for (var k = 0; k < test_collection.tests.length; k++) {
        var tests = test_collection.tests[k];
        test(
            tests[0],
            tests[1]
        );
    }
}
