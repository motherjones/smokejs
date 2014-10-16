var $ = require('jquery');
var Render = require('./render');
var Dust = require('../build/js/dust_templates')();
var Views = require('./edit_views');
var tweditor = require('./tweditor');

var Markdown = tweditor.markdown = require('./markdown');
tweditor.convert = function(cm) {
  var html = Markdown.toHTML(cm.getValue());
  var templateName = 'markdown_' + Math.random();
  var template = Dust.compile(html, templateName);
  Dust.loadSource(template);
  Render.render(templateName, {}, function(html) {
    tweditor.preview.html(html);
  });
};

exports.tweditor = function(textarea_selector) {
  var editor = tweditor.tweditor(textarea_selector);
  tweditor.menu.append(
      exports.makeStrikethroughButton(editor)
  );
  tweditor.menu.append(
    exports.makeLinkButton(editor)
  );
  tweditor.menu.append(
    exports.addImageButton(editor)
  );

  return editor;
}

exports.makeStrikethroughButton = function(editor) {
  var strikethroughButton = $('<li class="editButton"><i class="fa fa-strikethrough"></i></li>');
  strikethroughButton.on("click", function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' ~~'+newText+'~~ ', "end");
    editor.focus();
  });
  return strikethroughButton;
};

exports.makeLinkButton = function(editor) {
  var linkButton = $('<li class="editButton"><i class="fa fa-link"></i></li>');
  var linkFormOverlay = $('<div style="display:none;"><form><label for="url">URL</label><input type="text" name="url"/><button type="submit">OK</button></form></div>');
  linkFormOverlay.on('submit', function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    linkFormOverlay.hide();
    editor.replaceSelection(' ['+newText+']('+
      linkFormOverlay.find('[name="url"]').val()+
      ') ', "end");
    editor.focus();
    return false;
  });
  linkButton.on("click", function() {
    linkFormOverlay.show();
  });
  linkButton.append(linkFormOverlay);
  return linkButton;
};

exports.closeOverlayButton = function(overlay, callback) {
  callback = callback ? callback : function() {};
  var closeOverlay = function() {
    overlay.hide();
    callback();
  };
  var closeOverlayButton = $('<span>X</span>').click(closeOverlay);
  return closeOverlayButton;
};

exports.createImageOverlay = function(editor) {
  var imageFormOverlay = $('<div style="display:none"></div>');

  var closeOverlayButton = exports.closeOverlayButton(imageFormOverlay, resetImageOverlay);

  var newImageButton = $('<button>New Image</button>').click(function() {
    Views.createImageForm({},
      function(form) {
        imageFormOverlay.remove().append(closeOverlay).append(form);
      },
      editImage
    );
  });

  var editImage = function() {
    Views.editImageForm({},
      function(form) {
        imageFormOverlay.remove().append(closeOverlay).append(form);
      },
      imageFormCallback
    );
  };

  var imageFormCallback = function(component) {
    editor.replaceSelection('!!['+component.slug+'] ', "end");
    editor.focus();
  };

  var resetImageOverlay = function() {
    imageFormOverlay.empty();
    Views.selectImageForm({}, function(form) {
      imageFormOverlay
        .append(closeOverlayButton)
        .append(form)
        .append(newImageButton);
    }, imageFormCallback);
  };

  resetImageOverlay();

  return imageFormOverlay;
};

exports.addImageButton = function(editor) {
  var imageButton = $('<li class="editButton"><i class="fa fa-picture-o"></i></li>');
  var imageFormOverlay = exports.createImageOverlay(editor);
  imageButton.on("click", function() {
    imageFormOverlay.show();
  });
  imageButton.append(imageFormOverlay);

  return imageButton;
};
