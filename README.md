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

#### grunt serve
  Spins up a server, at localhost:9001. While serve is running, any changes made to smoke's source javascript will be automatically browserified and served. Any template changes will be compiled, browserified, and served.
  Sometimes browserification takes a couple seconds, if your changes don't seem to be showing up, check the cli where you're running grunt serve to make sure browserification has finished

#### grunt jsdoc
  Turns our inline documentation into documentation that can be read.
  Hopefully soon we'll have a section on how to add to our documentation

## Examples
_(Coming soon)_
## Release History
_(Nothing yet)_
