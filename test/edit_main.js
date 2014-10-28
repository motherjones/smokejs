var router = require('../js/router');
var routes = require('../js/routes');
var editRoutes = require('../js/edit_routes');
var sinon = require('sinon');
var should = require('should');
var _ = require('lodash');

describe("edit main", function() {
  var self = new Object();
  before(function() {
    self.browserStart = sinon.stub(router, "browserStart", function() {});
    self.addRoutes = sinon.stub(router, "addRoutes", function() {});
  });
  after(function() {
    self.browserStart.restore();
    self.addRoutes.restore();
  });
  it("runs", function() {
    var main = require('../js/edit_main');
    self.browserStart.calledOnce.should.be.true;
    self.addRoutes.calledOnce.should.be.true;
    self.addRoutes.calledWith(routes.concat(editRoutes)).should.be.true;
  });
});
