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
  };
  views.displayMainContent(match, cb).then(function() {
    exports._makeEditable(component);
  });
};

exports.displayHomepage = function(match, callback) {
  views.displayHomepage(match, callback).then(function() {
    //make editable somehow
    // probably calling make editable on it? need to review the
    // splash page json
  });
};

exports._makeEditable = function(component) {
  if (Object.prototype.toString.call( component ) === '[object Array]') {
    exports._makeListEditable(component);
  } else {
    for (var meta in component.metadata) {
      exports._editableMetadata(component, meta);
    }
    for (var attr in component.attributes) {
      exports._makeEditable(component.attributes[attr]);
    }
    exports._editableData(component);
  }
  $('#' + component.slug).append(exports._createSaveButton(component));
};

exports._makeListEditable = function(array) {
  console.log(array);
  // uhhh. welp
};

exports._editableData = function(component) {
  console.log(component);
  // uhhh. welp
};
exports._editableMetadata = function(component, meta) {
  $('.' + component.slug + '.' + meta)
    .attr('contentEditable', true)
    .on('blur', function() {
      component.metadata[meta] = $(this).text();
      console.log('updated metadata', component.metadata[meta]);
    });
};

exports._socialSharingElement = function(component) {
  return "<div><h4>this could one day be an edit popup or something" + component.slug + "</h4></div>";
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
};

exports._successNotice = function(error) {
  // put up a flickering banner saying we failed
  console.log('updating failed!', error);
};
