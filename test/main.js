var router = require('../js/router');
var sinon = require('sinon');
var should = require('should');

describe("main", function() {
  var self = new Object();
  before(function() {
    self.browserStart = sinon.stub(router, "browserStart", function() {});
  });
  after(function() {
    self.browserStart.restore();
  });
  it("runs", function() {
    var main = require('../js/main');
    self.browserStart.calledOnce.should.be.true;
  });
});
