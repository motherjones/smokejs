'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');
var api = require('./api');
var _ = require('lodash');
/**
 * Add create and update methods to component objects
 * @module edit_api
 */

/**
 * @class
 */
exports.Data = api.Data;

/**
 * Creates and Updates the data object.
 */
exports.Data.prototype.update = function(callback) {
  var self = this;
  return api._promise_request({
    method: 'POST',
    uri: self.url,
    encoding: 'multipart/form-data',
    form: {
      body: self.data
    }
  }, callback);
};

/**
 * @class
 */
exports.Component = api.Component;

/**
 * Interally binds the appropiate data constructor
 * to the component.  Use when referencing from component
 * please use this.
 */
exports.Component.prototype._Data = exports.Data;

/**
 * Tells mirrors to make a new component and give us a slug for it
 * this function sends the post to create the component, then creates all the attributes
 * of the component, and then updates the attributes so they have the value currently on the component
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype.create = function() {
  return this._post();
};

/**
 * Makes a post to create a component. Does not create attributes!
 * @param {function} callback - Optional, callback is called with server response
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype._post = function(uri, callback) {
  var self = this;
  var payload = {
    slug: this.slug,
    content_type: this.contentType,
    schema_name: this.schemaName,
    metadata: this.metadata
  };
  return api._promise_request({
      method: 'POST',
      uri: EnvConfig.MIRRORS_URL + 'component/',
      json: payload
    }, callback
  );
};

/**
 * Tells mirrors to update a component's attributes and metadata
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype.update = function() {
  return this._put();
};

/**
 * Makes a put to update a component. Does not update attributes!
 * mostly useful for updating metadata, I guess
 * @param {function} callback - Optional, callback is called with server response
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype._put = function(callback) {
  var self = this;
  var payload = {
    slug: self.slug,
    content_type: self.contentType,
    schema_name: self.schemaName,
    metadata: self.metadata
  };
  return api._promise_request({
      method: 'PUT',
      uri: EnvConfig.MIRRORS_URL + 'component/' + self.slug + '/',
      json: payload
    }, callback
  );
};

/**
 * Changes an attribute of a component and makes sure the component knows it needs to patch it
 * @param {string} key - the key of the attribute you want to change
 * @param {component} component - the new attribute component
 * @returns {promise} promise resolved when attribute is set on server
 */
exports.Component.prototype.setAttribute = function(key, component) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!self.attributes[key]) {
      self.attributes[key] = component;
      self._createAttribute(key, component.slug).then(resolve, reject);
    } else {
      self.attributes[key] = component;
      self._updateAttribute(key, component.slug).then(resolve, reject);
    }
  });
};

/**
 * Creates an attribute for a slug. Does not
 * @param {string} attr - the key of the attribute you want to change
 * @returns {promise} promise - a promise which resolves when all attributes are updated
 */
exports.Component.prototype._createAttribute = function(attr) {
  var self = this;
  var payload = {
    name: attr,
  };
  //is array check
  if (_.isArray( this.attributes[attr] )) {
    payload.contents = [];
    for (var i = 0; i < this.attributes[attr].length; i++) {
      payload.contents.push(this.attributes[attr][i].slug);
    }
  } else {
    payload.child = this.attributes[attr].slug;
  }

  var uri = EnvConfig.MIRRORS_URL + 'component/' + this.slug + '/attribute/';
  return api._promise_request(
    {
      method: 'POST',
      uri: uri,
      json: payload
    }
  );
};

/**
 * Helper function to make calls to update a component's attribute
 * @param {attr} component - the attribute you want to update
 * @returns {promise} promise - a promise which resolves when attribute is updated
 */
exports.Component.prototype._updateAttribute = function(attr) {
  var url = EnvConfig.MIRRORS_URL + 'component/' +
    this.slug + '/attribute/' + attr + '/';
  var json;
  if (_.isArray( this.attributes[attr] )) {
    json = [];
    for (var i = 0; i < this.attributes[attr].length; i++) {
      json.push(this.attributes[attr][i].slug);
    }
  } else {
    json = { "name" : attr, "child" : this.attributes[attr].slug };
  }
  return api._promise_request(
    {
      method: 'PUT',
      uri: url,
      json: json
    }
  );
};

/**
 * Deletes a component
 * @returns {promise} promise resolved when the component is deleted
 */
exports.Component.prototype.delete = function() {
  return api._promise_request(
    {
      method: 'DELETE',
      uri: EnvConfig.MIRRORS_URL + 'component/' + this.slug
    }
  );
};

/**
 * Removes an attribute from a component
 * @param {attr} string - the attribute you want to delete
 * @returns {promise} promise resolved when attribute deleted on server
 */
exports.Component.prototype.deleteAttribute = function(attr) {
  var url = EnvConfig.MIRRORS_URL + 'component/' +
    this.slug + '/attribute/' + attr;
  return api._promise_request(
    {
      method: 'DELETE',
      uri: url
    }
  );
};
