'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');
var _ = require('lodash');

/**
 * Currently, a component object with a get function
 * @module api
 */


/**
 * Creates a callback function for mirrors requests
 * @param {function} resolve - called with response if response is ok
 * @param {function} reject - called with response if response is not ok
 * @param {function} callback - callback is called with server response body if status ok
 * @returns {function} The function to be called after update or create requests
 */
exports._success = function(resolve, reject, callback) {
  var cb = callback ? callback : function() {};
  return function(err, result, body) {
    if (result.statusText === "OK") {
      try {
        cb(body);
      } catch(e) {
        reject(e);
        return;
      } finally {
        resolve(result);
      }
    } else {
      EnvConfig.log(result);
      EnvConfig.ERROR_HANDLER(err);
      reject(result);
    }
  };
};


/**
 * Basic function for chaining requests and promises.
 * @param {args} - arguments passed to request
 * @param {callback} - callback will be called with body of response
 * @param {pull} - ignore ControlCache, currently unused.
 * @return {promise} - returns promise
 */
exports._promise_request = function(args, callback, pull) {
  var promise = new Promise(function(resolve, reject) {
    request(args, exports._success(resolve, reject, callback));
  });
  return promise;
};

/**
 * Component constructor
 * @class
 * @param {string} - slug the id of the componet
 */
exports.Component = function(slug, data) {
  this.slug = slug;
  this.attributes = [];
  this.metadata = {};
  this.contentType = null;
  this.schemaName = null;
  this.changed = {};

  if (data) {
    this._build(data);
  };
};

/**
 * Internal function for building attrbitutes and metadata
 * from a Components response.
 */
exports.Component.prototype._build = function(data) {
  this.metadata = data.metadata;
  this.contentType = data.content_type;
  this.schemaName = data.schema_name;
  _.each(data.attributes, function(name, attribute) {
    if (_(attribute).isArray()) {
      this.attributes[name] = [];
      _.each(attribute, function(index, item) {
        this.attributes[name].push(new exports.Component(item.slug, item));
      });
    } else {
      this.attributes[name] = new exports.Component(attribute.slug, attribute);
    }
    return this;
  });
};

/**
 * Checks localstorage for the component's data, calls out to mirrors if
 * localstorage doesn't have it or is stale
 * @function
 * @param {function} callback - is called after the GET request for the component completes with the JSON as the first argument
 * @param {boolean} pull - don't check local storage, pull from mirrors
 * @returns {promise} resolves after the callback is complete, fails on error
 */
exports.Component.prototype.get = function(callback, pull) {
  var self = this;
  return exports._promise_request(EnvConfig.MIRRORS_URL + 'component/' + self.slug + '/',
    function(body) {
      data = JSON.parse(body);
      self._build(data);
      callback(self);
    }
  );
};
