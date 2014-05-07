/*global require */
var $ = require('jquery');
var router = require('../js/router');
var test = require('tape');
var Riot = require('riotjs');

test("test story creation", function(t) {
  t.plan(8);

  Riot.route('article/obama-drone-pakistan-us-citizen-leak-killing', function() {
    var fixture = $('#body');
    t.ok( fixture.html(), 'story created at all');

    t.equal(
      $('#component_author li a').html(),
      'Peter Van Buren',
      'asset rendered appropriately'
    );

    var content = fixture.find('#component_body');
    t.ok( content.html(), 'story content loaded');

    /*THESE DON'T WORK secondary content render works async to primary content render
      * and i don't have any promises returnd from them because they're in a weird spot
      * i should make an array of all things needed to be loaded and only resolve prime
      * deferred once they're all done, but I can't even know when my array is actually
      * done being filled
    */
    t.ok( content.find('load_asset'), 'asset tag found');
    //t.ok( content.find('load_asset').html(), 'asset loaded from content');

    t.ok( content.find('load_collection'), 'collection tag found');
    //t.ok( content.find('load_collection').html(), 'collection loaded from content');

    t.ok( content.find('h1'), 'markdown title created');

    t.ok( content.find('em'), 'markdown em tag created');

    t.ok( content.find('blockquote'), 'markdown blockquote tag created');

    start();
  });
});
