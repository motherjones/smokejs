# oh sweet jesus don't use me i'm very much in a state of development
**Smoke** is a new front end for MotherJones.com.
## Installation
To work on this locally, you'll need:
* Node - The package manager installation instructions on [here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) managed to work for us.
* [npm](https://npmjs.org/) - Again, package manager version should be fine.
* grunt-cli installed globally
    sudo npm install grunt-cli -g
## Getting Started
    git clone git@github.com:benbreedlove/smokejs.git
    cd smokejs/
    npm install
    grunt serve

## Working on Smoke

### Important Grunt Commands
We're using grunt as our task manager. It has a few commands that will make developing on smoke much easier

#### grunt lint
  Runs our linter, [jshint](http://www.jshint.com/docs/), over smoke's javascript files, over our test's javascript files, and over the file we use to define our grunt tasks
  If the linter is complaining about something you're sure is okay, jshint can be configured by editing the .jshint file in the location where you want to change the linter configuration. (/js, /test, or /)

#### grunt test
  Runs our tests and gives us a code coverage percent.
  Hopefully we'll soon have a section on how our tests are constructed.

```javascript
/*global require */
var api = require('../js/api');
var response = require('./fixtures/article/1.json');
var utils = require('./utils');
var should = require('should');

// describe it before and after are added to the global scope
describe("component api", function() {
  describe("get", function() {
    beforeEach(function(done) {
      // Runs before every test in this describe
      done();
    });
    afterEach(function(done) {
      // Runs after every test in this describe
      done();
    });
    before(function(done) {
      this.slug = 'test';
      this.server = utils.mock_component(slug, response);
      done();
    });
    after(function(done) {
      this.server.restore();
      done();
    });
    it("returns data from mirrors", function(done) {
      var callback = function(data) {
        //Example of using should off the objects prototype
        data.should.have.property('slug', this.slug);
      };
      var component = new api.Component(this.slug);
      component.get(callback).then(function() {
        //Example of using should w/o extending prototype
        should(component).have.property('metadata');
        done();
      });
    });
    it("next test", function(done) {
      //
      // Put next test here
      //
      done();
    });
  });
});
```

#### grunt serve
  Spins up a server, at localhost:9001. While serve is running, any changes made to smoke's source javascript will be automatically browserified and served. Any template changes will be compiled, browserified, and served.
  Sometimes browserification takes a couple seconds, if your changes don't seem to be showing up, check the cli where you're running grunt serve to make sure browserification has finished

#### grunt jsdoc
  Turns our inline documentation into documentation that can be read.
  Hopefully soon we'll have a section on how to add to our documentation

### Adding new templates
  We are using [dust](http://akdubya.github.io/dustjs/) as our templating language.
  We've added 4 functions to dust that might be important to you.
#### ad `{#ad placement="bottommob" width="299" /}`
  Places an iframed ad to the page. The iframe will automatically resize to the height of the ad. It will not resize the width
  Requires a parameter telling smoke the placement, which it passes along to the ad server.
  You may also find it useful to pass along a width.
#### load `{#load slug="peter" template="byline" /}`
  Loads a new component from mirrors from a slug.
  Takes a slug parameter, and a template parameter.
  If a template parameter is not given, the component will be rendered with it's schemaName as the template
#### render `{#attributes.byline} {#render template="byline" /} {/attributes.byline}`
  Renders an already loaded component.
  In order to work you must set dust's context to the component you want to render. That's done with the `{#attributes.byline}new context is here{/attributes.byline}` stuff
  If a template parameter is not given, the component will be rendered with it's schemaName as the template
#### markdown `{#markdown data_uri="http://mirrors.motherjones.com/component/bengazhi/data" /}`
  This isn't actually implemented yet. :(  It'll be working soon. Promise.

### Making our templates play nice with our inline edit
  If you want to make a component inline editable, you have to jump through some hoops
#### Your rendered component must have a contained in an element w/ the id of your component's slug
  Thats how we know where to look for things that should be inline editable, and where to add the save button
#### Your metadata must be contained in an element with the attributes data-slug equal to your component's slug, and data-metadata equal to the metadata's name
  `<h2 data-slug="{slug}" data-metadata="dek">{dek}</h2>`
#### If you want to make an attribute that is a list editable, your ul or ol must have the attributes data-slug equal to your component's slug, and data-attribute equal to the attributes name on your component
  `<ul data-attribute="byline" data-slug="{slug}">`
#### If you want to make an attribute that is a list editable, your list items must have the attribute data-slug equal to the list item's slug
  `<li data-slug="{slug}">{authorname}</li>`

## Examples
_(Coming soon)_
## Release History
_(Nothing yet)_
