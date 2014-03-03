/*global require */

module.exports = (function() {
    var unit_tests = {};
    unit_tests.tests = [];
    unit_tests.HiveMind = require('../js/hivemind');

    unit_tests.tests.push(["pulled hivemind", function() {
      expect(1);
      ok(unit_tests.HiveMind, "it's here");
    }]);

  unit_tests.tests.push(
    ["test template chooser with a good component",
     function() {
       expect(1);
       var article_component = {
	 schema_name: 'article',
	 content_type: 'text/x-markdown'
       };

       strictEqual(unit_tests.HiveMind.chooseTemplate(article_component),
	 	   'article',
		   'template chooser returns correct template name for a'
		   + ' correct schema and content type pair');
     }
    ]
  );

  unit_tests.tests.push(
    ["test template chooser with a bad schema name",
     function() {
       expect(1);
       var article_component = {
	 schema_name: 'srticle',
	 content_type: 'text/x-markdown'
       };

       strictEqual(unit_tests.HiveMind.chooseTemplate(article_component),
		   null,
		   'template chooser returns null for an unknown schema/content'
		   + ' type pair');
     }
    ]
  );

  unit_tests.tests.push(
    ["test template chooser with a bad content type",
     function() {
       expect(1);
       var article_component = {
	 schema_name: 'article',
	 content_type: 'image/jpeg'
       };

       strictEqual(unit_tests.HiveMind.chooseTemplate(article_component),
	   	   null,
		   'template chooser returns null for an unknown schema/content'
		   + ' type pair');
     }
    ]
  );

  unit_tests.tests.push(["test dust html filter", function() {
    expect(1);
    ok(false, "test not implemented yet");
  }]);


    return unit_tests;
})();
