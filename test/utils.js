/*global require */

var $ = require('jquery');
var sinon = require('sinon');

//TODO: Rename to component and change utils to
//mock
exports.mock_component = function(slug, json, data) {
  var server = sinon.fakeServer.create();
  server.respondWith('GET', '/mirrors/component/'+slug+'/', [200,
    { "Content-Type": "application/json" },
    JSON.stringify(json)
  ]);
  if(data) {
    server.respondWith('GET', '/mirrors/component/'+slug+'/data', [200,
      { "Content-Type": data['content-type'] },
      data['response']
    ]);
  }
  server.autoRespond = true;
  return server;
};

exports.mock_component_attributes = function(slug, attributes, json) {
  var server = sinon.fakeServer.create();
  if(attributes && attributes.length) {
    for (var attr in attributes) {
      server.respondWith('POST', '/mirrors/component/'+slug+'/attribute/', [200,
        { "Content-Type": "application/json" },
        JSON.stringify(json)
      ]);
      server.respondWith('PUT', '/mirrors/component/'+slug+'/attribute/' + attr, [200,
        { "Content-Type": "application/json" },
        JSON.stringify(json)
      ]);
    }
  }
  server.autoRespond = true;
  return server;
};

exports.mock_unauthorized = function(slug) {
  var server = sinon.fakeServer.create();
  server.respondWith('POST', '/mirrors/component/', [401,
    {},
    ''
  ]);
  server.respondWith('PATCH', '/mirrors/component/'+slug+'/', [401,
    {},
    ''
  ]);
  server.respondWith('GET', '/mirrors/component/'+slug+'/data', [404,
    {},
    ''
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

exports.div = function(html) {
  return $('<div></div>').html(html);
};

exports.el = function(html) {
  return $(html);
};
