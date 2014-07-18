'use strict';
//FIXME: make templates built outside of build
var Dust = require('../build/js/dust_templates')();
var api = require('./api');
var EnvConfig = require('./config');
//var Markdown = require('./markdown');
var Ad = require('./ad');
var Promise = require('promise-polyfill');

/**
 * Renders data with dust templates
 * @module render
 */

/**
 * Creates a callback function for mirrors requests
 * @param {string} template - the dust template to use
 * @param {object} data - the data to render the template with
 * @param {function} callback - callback is called with the results of the rendered template
 * @returns {promise} A promise that resolves when rendering is done
 */
exports.render = function(template, data, callback) {
  var promise = new Promise(function(resolve, reject) {
    var context = exports.dustBase().push(data);
    Dust.render(template, context,
      function(err, out) {  //callback
        if (err) {
          EnvConfig.ERROR_HANDLER(err, this);
          reject(err);
        }
        callback(out);
        resolve(out);
      }
    );
  });
  return promise;
};

/**
 * Creates dust readable context available for all dust templates
 * @returns {dustbase} the context passed along to all dust rendering
 */
exports.dustBase = function() {
  return Dust.makeBase({
    /**
     * Where we store our media (images, etc).
     * Placed into dust template's global context.
     * @inner
     */
    mediaBase : EnvConfig.MEDIA_STORE,
    /**
     * A function which loads a component from mirrors.
     * Placed into dust template's global context.
     * Template usage: `{#load slug="{string}" [template="{string}"] /}`
     * @param {chunk} chunk - How dust tells where to put the returned html
     * @param {object} context - The dust context when load is called
     * @param {object} bodies - Access to any bodies defined within the calling block.
     * @param {object} params - Parameters passed in by the template writer. Requires slug, the slug of the component you wish to load. optional template the template to render the component with
     * @returns {dust_promise} - the way dust handles callbacks, resolved when chunk.end is called w/ the html result
     * @inner
     */
    load : function(chunk, context, bodies, params) {
      var slug = params.slug ? params.slug : params.id;
      return chunk.map(function(chunk) {
        var component = new api.Component(slug);
        component.get(function(data) {
          var template = params.template ? params.template : data.schemaName;
          exports.render(template, data, function(html) {
            chunk.end(html);
          });
        });
      });
    },
    /**
     * A function to render a component from dust context.
     * Placed into dust template's global context.
     * Template usage: `{#componentContext} {#render [template="{string}"] /} {/componentContext}`
     * @param {chunk} chunk - How dust tells where to put the returned html
     * @param {object} context - The dust context when load is called
     * @param {object} bodies - Access to any bodies defined within the calling block.
     * @param {object} params - Parameters passed in by the template writer. Optional template, the template to render the component with
     * @returns {dust_promise} - the way dust handles callbacks, resolved when chunk.end is called w/ the html result
     * @inner
     */
    render : function(chunk, context, bodies, params) {
      return chunk.map(function(chunk) {
        exports.render(params.template, context.stack.head, function(html) {
          chunk.end(html);
        });
      });
    },
    /**
     * A function to place an ad in a template.
     * Placed into dust template's global context.
     * Template usage: `{#ad placement="{string}" /}`
     * @param {chunk} chunk - How dust tells where to put the returned html
     * @param {object} context - The dust context when load is called
     * @param {object} bodies - Access to any bodies defined within the calling block.
     * @param {object} params - Parameters passed in by the template writer. Required placement, the placement as the ad server knows it. Optional width, the width of the ad
     * @returns {dust_promise} - the way dust handles callbacks, resolved when chunk.end is called w/ the html result
     * @inner
     */
    ad : function(chunk, context, bodies, params) {
      return chunk.map(function(chunk) {
        Ad.currentAds[params.placement] = true;
        params.src = Ad.getSrc(params.placement);
        exports.render('ad_iframe', params, function(html) {
          chunk.end(html);
        });
      });
    },
    /**
     * A function to render markdown in dust.
     * Placed into dust template's global context.
     * Template usage: `{#markdown data_uri="{string}" /}`
     * @param {chunk} chunk - How dust tells where to put the returned html
     * @param {object} context - The dust context when load is called
     * @param {object} bodies - Access to any bodies defined within the calling block.
     * @param {object} params - Parameters passed in by the template writer.
     * @returns {dust_promise} - the way dust handles callbacks, resolved when chunk.end is called w/ the html result
     * @inner
     */
    markdown : function(chunk, context, bodies, params) {
      return chunk.map(function(chunk) {
            chunk.end('we need to fix the fixture server');
        /*
        api.component(params.data_uri, function(data) {
          var html = Markdown.toHTML(data);
          // do we need a better way of making a random name?
          var templateName = 'markdown_' + Math.random();
          var template = Dust.compile(html, templateName);
          Dust.loadSource(template);
          exports.render(templateName, data, function(html) {
            chunk.end(html);
          });
        });
        */
      });
    },
  });
};
