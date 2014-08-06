# oh sweet jesus don't use me i'm very much in a state of development
**Smoke** is a new front end for MotherJones.com.
## Installation
To work on self locally, you'll need:
* Node - The package manager installation instructions on [here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) managed to work for us.
* [npm](https://npmjs.org/) - Again, package manager version should be fine.
* grunt-cli installed globally
    sudo npm install grunt-cli -g
## Getting Started
    git clone git@github.com:benbreedlove/smokejs.git
    cd smokejs/
    npm install
    grunt serve

We've currently got four example payloads that can be loaded through smoke.
[An example topic list](http://localhost:9001/topic/health_list/)
[An example article](http://localhost:9001/article/drones)
[An example author page](http://localhost:9001/author/peter)
[The homepage](http://localhost:9001)

## Working on Smoke

### Important Grunt Commands
We're using grunt as our task manager. It has a few commands that will make developing on smoke much easier

#### grunt lint
  Runs our linter, [jshint](http://www.jshint.com/docs/), over smoke's Javascript files, over our test's Javascript files, and over the file we use to define our grunt tasks
  If the linter is complaining about something you're sure is okay, jshint can be configured by editing the .jshint file in the location where you want to change the linter configuration. (/js, /test, or /)

#### grunt test
  Runs our tests and gives us a code coverage percent.
  Tests are run using the Mocha Test runner https://github.com/visionmedia/mocha
  Asserts are made using the should library https://github.com/visionmedia/should
  Sinon is used for fake server and timing http://sinonjs.org/docs/

```Javascript
/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

// describe it before and after are added to the global scope
describe("component api", function() {
  describe("get", function() {
    var self;
    beforeEach(function() {
      // Runs before each test in self describe
      var self = new Object;
      self.slug = 'test';
      self.server = utils.mock_component(slug, response);
    });
    afterEach(function() {
      // Runs after each test in self describe
      self.server.restore();
    });
    before(function() {
      //Runs once before all tests after self.
    });
    after(function() {
    });
    it("returns data from mirrors", function(done) {
      var callback = function(data) {
        //Example of using should off the objects prototype
        data.should.have.property('slug', self.slug);
      };
      var component = new api.Component(self.slug);
      component.get(callback).then(function() {
        //Example of using should w/o extending prototype
        should(component).have.property('metadata');
        //done is an arguement for it or before/after
        //call it on async calls to end the test
        done();
      });
    });
    it("next test", function() {
      //
      // Put next test here
      //
    });
  });
});
```

#### grunt serve
  Spins up a server, at localhost:9001. While serve is running, any changes made to smoke's source Javascript will be automatically browserified and served. Any template changes will be compiled, browserified, and served.
  Sometimes browserification takes a couple seconds, if your changes don't seem to be showing up, check the cli where you're running grunt serve to make sure browserification has finished

#### grunt jsdoc
  Turns our inline documentation into documentation that can be read.
  Hopefully soon we'll have a section on how to add to our documentation

### Adding new templates
  We are using [dust](http://akdubya.github.io/dustjs/) as our templating language.
  We've added 4 functions to dust that might be important to you.
* ad `{#ad placement="bottommob" width="299" /}`
  Places an iframed ad to the page. The iframe will automatically resize to the height of the ad. It will not resize the width
  Requires a parameter telling smoke the placement, which it passes along to the ad server.
  You may also find it useful to pass along a width.
* load `{#load slug="peter" template="byline" /}`
  Loads a new component from mirrors from a slug.
  Takes a slug parameter, and a template parameter.
  If a template parameter is not given, the component will be rendered with it's schemaName as the template
* render `{#attributes.byline} {#render template="byline" /} {/attributes.byline}`
  Renders an already loaded component.
  In order to work you must set dust's context to the component you want to render. That's done with the `{#attributes.byline}new context is here{/attributes.byline}` stuff
  If a template parameter is not given, the component will be rendered with it's schemaName as the template
* markdown `{#markdown data_uri="http://mirrors.motherjones.com/component/bengazhi/data" /}`
  Turns markdown into html, then runs it through dust templating.
* list `{#list attribute="{string}" template="{string}" [delimiter="{string}"] /}`
  Renders an attribute list. Handles all the data-attribute stuff you need to make a list sortable

### Making our templates play nice with our inline edit
  If you want to make a component inline editable, you have to jump through some hoops
* Your rendered component must have a contained in an element w/ the id of your component's slug.
  Thats how we know where to look for things that should be inline editable, and where to add the save button.
* Your metadata must be contained in an element with the attributes data-slug equal to your component's slug, and data-metadata equal to the metadata's name.
  `<h2 data-slug="{slug}" data-metadata="dek">{dek}</h2>`.

## Examples
_(Coming soon)_
## Release History
_(Nothing yet)_
