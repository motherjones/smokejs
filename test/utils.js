/*global require */

var $ = require('jquery');

exports.mock_component = function(slug, response) {
  var server = sinon.fakeServer.create();
  server.respondWith('GET', '/mirrors/component/'+slug, [200,
    { "Content-Type": "application/json" },
    JSON.stringify(response)
  ]);
  server.autoRespond = true;
  return server;
};

exports.mock_chunk = function() {
  return {
    map : function(callback) {
      this.promise = new $.Deferred();
      callback(this);
      return this.promise;
    },
    end : function(html) {
      this.output = html;
      this.promise.resolve();
    }
  };
};
