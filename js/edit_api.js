'use strict';
var api = require('./api');
var _ = require('lodash');
var url = require('url');

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
  var cb = function() {
    callback(self);
  };
  return api._promise_request({
    method: 'POST',
    uri: self.uri,
    encoding: 'multipart/form-data',
    form: {
      body: self.data
    }
  }, cb);
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
 * @param callback{function}
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype.create = function(callback) {
  var self = this;
  var payload = {
    slug: self.slug,
    content_type: self.content_type,
    schema_name: self.schemaName,
    metadata: self.metadata
  };
  var cb = function() {
    if (callback) {
      callback(self);
    }
  };
  return api._promise_request({
      method: 'POST',
      uri: api.COMPONENT_URI_BASE,
      json: payload
    }, cb
  );
};

/**
 * Tells mirrors to update a component's attributes and metadata
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype.update = function(callback) {
  var self = this;
  var payload = {
    slug: self.slug,
    content_type: self.content_type,
    schema_name: self.schemaName,
    metadata: self.metadata
  };
  var cb = function() {
    if (callback) {
      callback(self);
    }
  };
  return api._promise_request({
      method: 'PUT',
      uri: self.uri,
      json: payload
    }, cb
  );
};

/**
 * Changes an attribute of a component and makes sure the component knows it needs to patch it
 * @param {string} key - the key of the attribute you want to change
 * @param {component} component - the new attribute component. Optional.
 * @returns {promise} promise resolved when attribute is set on server
 */
exports.Component.prototype.setAttribute = function(key, component) {
  if (!this.attributes[key]) {
    this.attributes[key] = component;
    return this._createAttribute(key);
  } else {
    if (component) {
      this.attributes[key] = component;
    }
    return this._updateAttribute(key);
  }
};

/**
 * Creates an attribute for a slug. Does not
 * @param {string} attr - the key of the attribute you want to change
 * @returns {promise} promise - a promise which resolves when all attributes are updated
 */
exports.Component.prototype._createAttribute = function(attr) {
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
  return api._promise_request(
    {
      method: 'POST',
      uri: url.resolve(this.uri, './attribute/'),
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
      uri: url.resolve(this.uri, './attribute/' + attr + '/'),
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
      uri: this.uri
    }
  );
};

/**
 * Removes an attribute from a component
 * @param {attr} string - the attribute you want to delete
 * @returns {promise} promise resolved when attribute deleted on server
 */
exports.Component.prototype.deleteAttribute = function(attr) {
 return api._promise_request(
    {
      method: 'DELETE',
      uri: url.resolve(this.uri, './attribute/' + attr + '/')
    }
  );
};
