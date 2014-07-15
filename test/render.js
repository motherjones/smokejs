var render = require('../js/render');
var Chunk = require('./utils').mock_chunk;
var Ad = require('../js/ad');
var utils = require('./utils');
var peter = require('./fixtures/author/peter.json');
var should = require('should');

describe("Render", function() {
  it('can render content', function (done) {
    var slug = 'lolnone';
    var author_first_name = 'dash';
    var author_last_name = 'rendar';
    render.render('byline', {
      slug : slug,
      metadata : { first_name: author_first_name, last_name: author_last_name }
    },
    function(out) {
      var el = utils.div(out);
      should(el.find('li').length).eql(1,
        'byline gives us a single list item'
      );
      should(el.find('a').attr('href')).eql('#/author/' + slug,
        'byline gives us a link to the author page of the author passed in'
      );
      should(el.find('a').html()).eql(author_first_name + ' ' + author_last_name,
        'Link text is the author\'s first and last name'
      );
    }).then(function() {
      should(true).ok;
      done();
    });
  });

  it( "can render ads", function(done) {
    var dustBase = render.dustBaseWrapper();
    var chunk = new Chunk();
    should(dustBase).not.be.empty;
    Ad.key = '';
    Ad.groupId = '';
    var ad_placement = 'test';
    dustBase.global.ad(chunk, {}, {}, {placement: ad_placement})
      .then(function() {
        var el = utils.div(chunk.output);
        should( el.find('iframe').length ).eql( 1,
          'gives us an iframe'
        );
        var iframe = el.find('iframe');
        should( iframe.attr('data-placement') ).eql(ad_placement,
          'sets data-placement attribute correctly'
        );
        should( iframe.attr('id') ).eql('ad_' + ad_placement,
          'sets the id to be ad_ and the placement'
        );
        should(iframe.attr('src')).eql(Ad.getSrc(ad_placement),
          'src should be set to what Ad\'s getSrc spits out'
        );
        done();
      });
  });

  it( "can load from mirrors from dust templates", function(done) {
    var dustBase = render.dustBaseWrapper();
    var slug = 'peter';
    var server = utils.mock_component(slug, peter);
    var chunk = new Chunk();
    dustBase.global.load(chunk, {}, {}, {
      slug: slug,
      template: 'byline'
    }).then(function() {
      var el = utils.div(chunk.output);
      should(el.find('li').length).eql(1,
        'dust load pulling a byline gives us a single list item'
      );
      should(el.find('a').attr('href')).eql('#/author/peter',
        'dust load pulling a byline gives us a link to the author page of the author passed in'
      );
      should(el.find('a').html()).eql('Peter Pan',
        'dust load pulling a byline gives us the author\'s first and last as link text'
      );
      server.restore();
      done();
    });
  });

  it( "can load from dust templates without a template specified", function(done) {
    var dustBase = render.dustBaseWrapper();
    var slug = 'peter';
    var server = utils.mock_component(slug, peter);
    var chunk = new Chunk();
    dustBase.global.load(chunk, {}, {}, {
      slug: slug
    })
    .then(function() {
      console.log('one');
      var el = utils.div(chunk.output);
      console.log('one');
      should( el.find('div.author').html() ).not.be.empty;
      console.log('one');
      var header = el.find('h1').html();
      console.log(header);
      should( header ).eql(
        '<span data-slug="peter" data-metadata="first_name">Peter</span>&nbsp;<span data-slug="peter" data-metadata="last_name">Pan</span>',
        'load w/o a template loads an author, which has an h1 w/ authorname'
      );
      console.log('one');
      should( el.find('.component_body').html() ).not.be.empty;
      console.log('one');
      server.restore();
      done();
    });
  });

  it( "can load markdown", function(done) {
    var dustBase = render.dustBaseWrapper();
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
        console.log(chunk.output);
        should( chunk.output ).eql( '<h1>#Test</h1>',
          'expected <h1>#Test</h1>, got ' + chunk.output
        );
      server.restore();
      done();
    });
  });

  it( "can render subtemplates without loading", function(done) {
    var dustBase = render.dustBaseWrapper();
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
      var el = utils.div(chunk.output);
      should(el.find('li').length).eql( 1,
        'expected 1, got' + el.find('li').length + ' which may be a problem. thml out was' +
        chunk.output
      );
      should(el.find('a').attr('href')).eql('#/author/peter-pan',
        'dust renders a byline gives us a link to the author page of the author passed in'
      );
      should(el.find('a').html()).eql('Peter Pan',
        'dust renders a byline gives us the author\'s first and last as link text'
      );
      done();
    });
  });

});
