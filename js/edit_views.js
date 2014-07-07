var api = require('./edit_api');
var render = require('./render');
var views = require('./views');
var $ = require('jquery');

// REWRITE ALL OF THESE TO SHOW THE EDIT TEMPLATES NOT THE NORMAL ONES
exports.displayMainContent = function(match, callback) {
  callback = callback ? callback : function() {};
  var component;
  var cb = function(data, html) {
    component = data;
    html += exports._socialSharingElement(component);
    callback(data, html);
  }
  views.displayMainContent(match, cb).then(function() {
    exports._makeEditable(component);
  });
};

exports.displayHomepage = function(callback) {
  views.displayHomepage(match, callback).then(function() {
    //make editable somehow
  });
};

exports._makeEditable = function(component) {
  for (var attr in component.metadata) {
    exports._editableMetadata(component, attr);
  }
  $('body').append(exports._createSaveButton(component));
};

exports._editableMetadata = function(component, attr) {
  $('.' + component.slug + '.' + attr)
    .attr('contentEditable', true)
    .on('blur', function() {
      component.metadata[attr] = $(this).text();
      console.log('updated metadata', component.metadata[attr]);
    });
}

exports._socialSharingElement = function(component) {
  return "<div><h4>this could one day be an edit popup or something</h4></div>";
};
exports._createSaveButton = function(component) {
  return $('<button>Save</button>')
    .click(function() {
      component.update().then(
        exports._successNotice,
        exports._failureNotice
      );
    }
  );
};

exports._successNotice = function() {
  // put up a flickering banner saying we saved or something
  console.log('updated successfully');
}

exports._successNotice = function(error) {
  // put up a flickering banner saying we failed
  console.log('updating failed!', error);
}
