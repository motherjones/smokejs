/*global module */
'use strict';

module.exports = (function() {
  var Dust = require('../../build/js/dust_templates')();
  var API = require('./api');
  var EnvConfig = require('./config');
  var $ = require('jquery');
  var Markdown = require('./markdown');
  var Ad = require('./ad');

  var dustBase = function() { 
    return Dust.makeBase({
      mediaBase : EnvConfig.MEDIA_STORE,
      load:  function(chunk, context, bodies, params) {
        var slug = params.slug ? params.slug : params.id;
        return chunk.map(function(chunk) {
          API.load(slug, function(data) {
            var template = params.template ? params.template : data.template;
            render(data, template, function(html) {
              chunk.end(html);
            });
          });
        });
      },
      ad:  function(chunk, context, bodies, params) {
        Ad.CurrentAds[params.placement] = true;
        params.src = Ad.getSrc(params);
        render(params, 'ad_iframe', function(html) {
          chunk.end(html);
        });
      },
      render:  function(chunk, context, bodies, params) {
        return chunk.map(function(chunk) {
          render(params, params.template, function(html) {
            chunk.end(html);
          });
        });
      },
      markdown:  function(chunk, context, bodies, params) {
                   console.log(context,bodies);
        return chunk.map(function(chunk) {
          var slug = params.slug ? params.slug : params.id;
          API.load(slug, function(data) {
            var html = Markdown.toHTML(data);
            // do we need a better way of making a random name?
            var templateName = 'markdown_' + Math.random();
            var template = Dust.compile(html, templateName);
            Dust.loadSource(template);
            render(templateName, data, function(html) {
              chunk.end(html);
            });
          });
        });
      },
    });
  };
  
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

  return render;

})();
