/*global require, window */

var test = require('tape');
var render = require('../js/render');
var $ = require('jquery');
var Chunk = require('./dust_chunk_mock');
var EnvConfig = require('../js/config');
var Ad = require('../js/ad');

test( "test main render function", function(t) {
  t.plan(3);
  var promise = render('byline', { 
    slug : 'lolnone',
    metadata : { first_name: 'test', last_name: 'render' }
  },
  function(out) {
    t.equal(out,
      '<li><a href="#/author/lolnone">test render</a></li>',
      'byline template rendered as expected'
    );
  });

  t.ok(promise,
    'render function returns a promise'
  );

  $.when(promise).done(function() {
    t.ok(true, 'render promise resolved');
  });
});

test( "test dust functions", function(t) {
  t.plan(4);
  var dustBase = render.dustBase();
  var chunk = new Chunk();
  t.ok(dustBase, 'dust base created');


  Ad.key = '';
  Ad.groupId = '';
  $.when(dustBase.global.ad(chunk, {}, {}, {placement: 'test'}))
    .done(function() {
        t.equal( chunk.output, 
          '<iframe class="ads" data-placement="test" id="ad_test"data-resizable="resizable"scrolling="no" frameborder="0"sandbox="allow-scripts allow-same-origin"src="' +
            EnvConfig.AD_LOCATION +
              '#placement=test&groupid=&key=&height=0&uri=' +
              window.location.pathname + 
            '"seamless></iframe>',
          'ad dust function rendered correctly'
        );
    });

  $.when(dustBase.global.load(chunk, {}, {}, {
    slug: 'peter-van-buren',
    template: 'byline'
  }))
  .done(function() {
      t.equal( chunk.output, 
        '<li> <a href="#/author/peter-van-buren"> Peter Van Buren </a> </li>',
        'load dust function rendered correctly with template specified'
      );
  });

  $.when(dustBase.global.load(chunk, {}, {}, {
    slug: 'peter-van-buren',
  }))
  .done(function() {
      t.equal( chunk.output, //FIXME we maybe should get twittername into our fixtures 
        '<div class="author"> <h1>Peter Van Buren</h1> @ </div> <section id="component_body"> <b>Data url</b>: ' +
        EnvConfig.DATA_STORE + 'component/peter-van-buren </section> ', //FIXME note that this assumes we can't pull markdonw yet
        'load dust function rendered correctly without template specified'
      );
  });

  $.when(dustBase.global.render(chunk, {
    stack: {
      head: {
        metadata: {
          first_name: 'Peter',
          last_name: 'Van Buren',
        },
        slug: 'peter-van-buren'
      }
    }
  }, {}, {
    template: 'byline'
  }))
  .done(function() {
      t.equal( chunk.output, 
        '<li><a href="#/author/peter-van-buren">Peter Van Buren</a></li>',
        'render dust function rendered correctly with template specified'
      );
  });

  $.when(dustBase.global.markdown(chunk, {}, {}, 
    { data_uri: 'content/peter-van-buren/data' }
    ))
    .done(function() {
      t.equal( chunk.output, 
        'we need to fix the fixture server',
        'markdown doenst actually load, boooooo'
      );
  });
});
