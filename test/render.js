var test = require('tape');
var render = require('../js/render');
var $ = require('jquery');
var Chunk = require('./utils').mock_chunk;
var Ad = require('../js/ad');
var utils = require('./utils');
var peter = require('./fixtures/author/peter.json');

test( "test main render function", function(t) {
  t.plan(5);
  var slug = 'lolnone';
  var author_first_name = 'dash';
  var author_last_name = 'rendar';
  var promise = render.render('byline', {
    slug : slug,
    metadata : { first_name: author_first_name, last_name: author_last_name }
  },
  function(out) {
    var el = $('<div />').html(out);
    t.equal(el.find('li').length, 1,
      'byline gives us a single list item'
    );
    t.equal(el.find('a').attr('href'), '#/author/' + slug,
      'byline gives us a link to the author page of the author passed in'
    );
    t.equal(el.find('a').html(), author_first_name + ' ' + author_last_name,
      'Link text is the author\'s first and last name'
    );
  });
  t.ok(promise,
    'render function returns a promise'
  );
  promise.then(function() {
    t.ok(true, 'render promise resolved');
  });
});

test( "test dust ad function", function(t) {
  t.plan(5);
  var dustBase = render.dustBase();
  var chunk = new Chunk();
  t.ok(dustBase, 'dust base created');
  Ad.key = '';
  Ad.groupId = '';
  var ad_placement = 'test';
  dustBase.global.ad(chunk, {}, {}, {placement: ad_placement})
    .then(function() {
      var el = $('<div />').html(chunk.output);
      t.equal( el.find('iframe').length, 1,
        'gives us an iframe'
      );
      var iframe = el.find('iframe');
      t.equal( iframe.attr('data-placement'), ad_placement,
        'sets data-placement attribute correctly'
      );
      t.equal( iframe.attr('id'), 'ad_' + ad_placement,
        'sets the id to be ad_ and the placement'
      );
      t.equal( iframe.attr('src'), Ad.getSrc(ad_placement),
        'src should be set to what Ad\'s getSrc spits out'
      );
      t.end();
    });
});


test( "test dust load with template", function(t) {
  t.plan(3);
  var dustBase = render.dustBase();
  var server = utils.mock_component('peter', peter);
  var chunk = new Chunk();
  dustBase.global.load(chunk, {}, {}, {
    slug: 'peter',
    template: 'byline'
  }).then(function() {
    var el = utils.el(chunk.output);
    t.equal(el.find('li').length, 1,
      'dust load pulling a byline gives us a single list item'
    );
    t.equal(el.find('a').attr('href'), '#/author/peter',
      'dust load pulling a byline gives us a link to the author page of the author passed in'
    );
    t.equal(el.find('a').html(), 'Peter Pan',
      'dust load pulling a byline gives us the author\'s first and last as link text'
    );
    server.restore();
    t.end();
  });
});


test( "test dust load without template", function(t) {
  t.plan(3);
  var dustBase = render.dustBase();
  var server = utils.mock_component('peter', peter);
  var chunk = new Chunk();
  dustBase.global.load(chunk, {}, {}, {
    slug: 'peter'
  })
  .then(function() {
    var el = utils.el(chunk.output);
    console.log(el.children());
    t.ok( el.find('div.author'),
      'load w/o a template loads an element w/ class author'
    );
    t.equal( el.find('h1').html(), 'Peter Pan',
      'load w/o a template loads an author, which has an h1 w/ authorname'
    );
    t.ok( el.find('#component_body').html(),
      'load w/o a template loads an author, which has makrdown text in it'
    );
    t.end();
  });
});

test( "test dust render with template", function(t) {
  t.plan(3);
  var dustBase = render.dustBase();
  var chunk = new Chunk();
  dustBase.global.render(chunk, {
    stack: {
      head: {
        metadata: {
          first_name: 'Peter',
          last_name: 'Pan',
        },
        slug: 'peter-pan'
      }
    }
  }, {}, {
    template: 'byline'
  })
  .then(function() {
    var el = utils.el(chunk.output);
    t.equal(el.find('li').length, 1,
      'dust renders a byline gives us a single list item'
    );
    t.equal(el.find('a').attr('href'), '#/author/peter-pan',
      'dust renders a byline gives us a link to the author page of the author passed in'
    );
    t.equal(el.find('a').html(), 'Peter Pan',
      'dust renders a byline gives us the author\'s first and last as link text'
    );
  });
});

test( "test dust load markdown", function(t) {
  t.plan(1);
  var dustBase = render.dustBase();
  var chunk = new Chunk();
  var data = {
    'content-type': 'application/x-markdown',
    'response': '#Test'
  };
  var server = utils.mock_component('peter', peter, data);
  dustBase.global.markdown(chunk, {}, {},
    { data_uri: 'content/peter-pan/data' }
    )
    .then(function() {
      t.equal( chunk.output,
        '<h1>#Test</h1>',
        'markdown loads'
      );
  });
});

