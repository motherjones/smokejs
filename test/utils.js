exports.mock_component = function(slug, response) {
  var server = sinon.fakeServer.create();
  server.respondWith('GET', '/mirrors/component/'+slug, [200,
    { "Content-Type": "application/json" },
    JSON.stringify(response)
  ]);
  server.autoRespond = true;
  return server;
};
