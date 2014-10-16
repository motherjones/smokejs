var views = require('./views');
var editor = require('./editor');
var api = require('./edit_api');
var render = require('./render');
/**
 * Includes views to be called by the router.
 * Each should take a callback that takes in data, and html.
 * Each should return a promise which is resolved after components are loaded
 * @module edit_views
 */

/**
 * Main view for rendering components and making them editable.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is called with html
 * @returns {promise} Resolves when complete
 */
exports.displayMainContent = function(match, callback) {
  callback = callback ? callback : function() {};
  var cb = function(data, html) {
    var component = new api.Component(data.slug, data);
    html += editor.socialSharingElement(component);
    callback(data, html);
    editor.makeEditable(component);
  };
  return views.displayMainContent(match, cb);
};

/**
 * View for rendering a create image form.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is when form is made
 * @param {function} formCallback - callback when image is created
 * @returns {promise} Resolves when complete
 */
exports.createImageForm = function(match, callback, formCallback) {
  callback = callback ? callback : function() {};
  formCallback = formCallback ? formCallback : editor.successNotice;
  return render.render('create_image_form', {}, function(html) {
    callback(
      editor.createImageForm(html, formCallback)
    );
  })
};

/**
 * View for rendering a select image form.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is when form is made
 * @param {function} formCallback - callback when image is selected
 * @returns {promise} Resolves when complete
 */
exports.selectImageForm = function(match, callback, formCallback) {
  callback = callback ? callback : function() {};
  formCallback = formCallback ? formCallback : editor.successNotice;
  return render.render('select_image_form', {}, function(html) {
    callback(
      editor.selectImageForm(html, formCallback)
    );
  })
};

/**
 * View for rendering an edit image form.
 * @param {object} match - match object Returned by routes.
 * @param {function} callback - callback is when form is made
 * @param {function} formCallback - callback when image is selected
 * @returns {promise} Resolves when complete
 */
exports.editImageForm = function(match, callback, formCallback) {
  callback = callback ? callback : function() {};
  formCallback = formCallback ? formCallback : editor.successNotice;
  var slug = match.params.slug;
  var component = new api.Component(slug);
  return render.render('edit_image_form', {}, function(html) {
    callback(
      editor.editImageForm(html, formCallback)
    );
  })
};
