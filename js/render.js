'use strict';
module.exports = (function() {
  //FIXME: make templates built outside of build
  var Dust = require('../build/js/dust_templates')();
  var API = require('./api');
  var EnvConfig = require('./config');
  var $ = require('jquery');
  var Markdown = require('./markdown');
  var Ad = require('./ad');
  var render = function(template, data, callback) {
    var promise = new $.Deferred();
    var context = dustBase().push(data);
    Dust.render(template, context,
      function(err, out) {  //callback
        if (err) {
          EnvConfig.ERROR_HANDLER(err, this);
        }
        callback(out);
        promise.resolve();
      }
    );
    return promise;
  };
  var dustBase = render.dustBase = function() {
    return Dust.makeBase({
      mediaBase : EnvConfig.MEDIA_STORE,
      load:  function(chunk, context, bodies, params) {
        var slug = params.slug ? params.slug : params.id;
        return chunk.map(function(chunk) {
          API.load(slug, function(data) {
            var template = params.template ? params.template : data.template;
            render(template, data, function(html) {
              chunk.end(html);
            });
          });
        });
      },
      ad:  function(chunk, context, bodies, params) {
        return chunk.map(function(chunk) {
          Ad.CurrentAds[params.placement] = true;
          params.src = Ad.getSrc(params.placement);
          render('ad_iframe', params, function(html) {
            chunk.end(html);
          });
        });
      },
           /* IMPORTANT! THIS USES CONTEXT, YOU PROBABLY WANT LOAD */
      render:  function(chunk, context, bodies, params) {
        return chunk.map(function(chunk) {
          render(params.template, context.stack.head, function(html) {
            chunk.end(html);
          });
        });
      },
      markdown:  function(chunk, context, bodies, params) {
        return chunk.map(function(chunk) {
              chunk.end('we need to fix the fixture server');
          /*
          API.load(params.data_uri, function(data) {
            var html = Markdown.toHTML(data);
            // do we need a better way of making a random name?
            var templateName = 'markdown_' + Math.random();
            var template = Dust.compile(html, templateName);
            Dust.loadSource(template);
            render(templateName, data, function(html) {
              chunk.end(html);
            });
          });
          */
        });
      },
    });
  };
  return render;
})();
