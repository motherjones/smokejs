'use strict';
var EnvConfig = require('./config');
var request = require('browser-request');
var Promise = require('promise-polyfill');
var api = require('./api');
/**
 * Add create and update methods to component objects
 * @module edit_api
 */

/**
 * @class
 */
exports.Component = api.Component;

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
    schemaName: this.schemaName,
    metadata: this.metadata
  };
  return new api._promise_request({
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
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    self._post().then(function() {
      self.createAndUpdateAttributes().then(resolve, reject);
    }, reject);
  });
  return promise;
};

/**
 * Makes a put to update a component. Does not update attributes!
 * mostly useful for updating metadata, I guess
 * @param {function} callback - Optional, callback is called with server response
 * @returns {promise} Resolves when complete
 */
exports.Component.prototype._put = function(callback) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var payload = {
      slug: self.slug,
      content_type: self.contentType,
      schemaName: self.schemaName,
      metadata: self.metadata
    };
    request({
      method: 'PUT',
      uri: EnvConfig.MIRRORS_URL + 'component/' + self.slug,
      json: payload
    }, api._success(resolve, reject, callback)
    );
  });
};

/**
 * Changes an attribute of a component and makes sure the component knows it needs to patch it
 * @param {string} key - the key of the attribute you want to change
 * @param {whatever} value - the new attribute value
 * @returns {promise} promise resolved when attribute is set on server
 */
exports.Component.prototype.setAttribute = function(key, value) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!self.attributes[key]) {
      self.attributes[key] = value;
      self._createAttribute(key).then(resolve, reject);
    } else {
      self.attributes[key] = value;
      self._updateAttribute(key).then(resolve, reject);
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
  if (Object.prototype.toString.call( this.attributes[attr] ) === '[object Array]') {
    payload.contents = this.attributes[attr];
  } else {
    payload.child = this.attributes[attr].slug;
  }

  var uri = EnvConfig.MIRRORS_URL + 'component/' + this.slug + '/attribute/';
  return new Promise(function(resolve, reject) {
    delete self.createdAttributes[attr];
    var rej = function() {
      self.createdAttributes[attr] = true;
      reject();
    };
    request({
      method: 'POST',
      uri: uri,
      json: payload
    }, api._success(resolve, rej)
    );
  });
};
/**
 * Helper function to make calls to update a component's attribute
 * @param {attr} component - the attribute you want to update
 * @returns {promise} promise - a promise which resolves when attribute is updated
 */
exports.Component.prototype._updateAttribute = function(attr) {
  var self = this;
  var url = EnvConfig.MIRRORS_URL + 'component/' +
    this.slug + '/attribute/' + attr;
  return new Promise(function(resolve, reject) {
    delete self.changedAttributes[attr];
    var rej = function() {
      self.changedAttributes[attr] = true;
      reject();
    };
    request({
      method: 'PUT',
      uri: url,
      json: self.attributes[attr]
    }, api._success(resolve, rej)
    );
  });
};
