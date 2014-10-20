var $ = require('jquery');
var Render = require('./render');
var Dust = require('../build/js/dust_templates')();
var Views = require('./edit_views');
var Markdown = require('./markdown');
var tweditor = require('./tweditor');


exports.tweditor = function(textarea_selector) {
  tweditor.buttons.push(exports.makeStrikethroughButton);
  tweditor.buttons.push(exports.makeLinkButton);
  tweditor.buttons.push(exports.addImageButton);

  tweditor.convert = exports.convert;
  tweditor.markdown = Markdown;

  return tweditor.tweditor(textarea_selector);
}

exports.convert = function(cm, preview) {
  var html = Markdown.toHTML(cm.getValue());
  var templateName = 'markdown_' + Math.random();
  var template = Dust.compile(html, templateName);
  Dust.loadSource(template);
  Render.render(templateName, {}, function(html) {
    preview.html(html);
  });
};

exports.makeStrikethroughButton = function(editor, viewer) {
  var strikethroughButton = $('<li class="editButton"><i class="fa fa-strikethrough"></i></li>');
  strikethroughButton.on("click", function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' ~~'+newText+'~~ ', "end");
    editor.focus();
  });
  return strikethroughButton;
};

exports.makeLinkButton = function(editor, viewer) {
  var linkButton = $('<li class="editButton"><i class="fa fa-link"></i></li>');
  var linkFormOverlay = $('<div class="link-form-overlay"><form><label for="url">URL</label><input type="text" name="url"/><button type="submit">OK</button></form></div>');
  linkFormOverlay.hide();
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
  var closeOverlayButton = $('<span class="close-wysiwyg-button">X</span>').click(closeOverlay);
  return closeOverlayButton;
};

exports.createImageOverlay = function(editor) {
  var imageFormOverlay = $('<div class="image-form-overlay"></div>');
  imageFormOverlay.hide();

  var closeOverlayButton = exports.closeOverlayButton(imageFormOverlay, resetImageOverlay);

  var newImageButton = $('<button class="new-image">New Image</button>').click(function() {
    Views.createImageForm({},
      function(form) {
        imageFormOverlay.empty();
        imageFormOverlay.append(closeOverlayButton).append(form);
        console.log('lol wat');
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
