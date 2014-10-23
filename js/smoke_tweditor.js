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
  tweditor.buttons.push(exports.addMininavButton);

  tweditor.buttons[6] = exports.headerButton;

  tweditor.convert = exports.convert;
  tweditor.markdown = Markdown;

  return tweditor.tweditor(textarea_selector);
};

exports.convert = function(cm, preview) {
  var html = Markdown.toHTML(cm.getValue());
  var templateName = 'markdown_' + Math.random();
  var template = Dust.compile(html, templateName);
  Dust.loadSource(template);
  Render.render(templateName, {}, function(html) {
    preview.html(html);
  });
};

exports.headerButton = function(editor) {
//exports.headerButton = function(editor, viewer) {
  console.log('in here');
  var headerButton = $('<li class="editButton"><i class="fa fa-header"></i></li>');
  headerButton.on("click", function() {
    editor.replaceSelection('\n###'+editor.getSelection().replace(/[\*\#]/, '', 'g')+'\n', "end");
    var cursorStart = editor.getCursor("start");
    var cursorEnd = editor.getCursor("end");
    editor.setSelection(cursorStart, cursorEnd);
    editor.focus();
  });
  return headerButton;
};

//exports.makeStrikethroughButton = function(editor, viewer) {
exports.makeStrikethroughButton = function(editor) {
  var strikethroughButton = $('<li class="editButton"><i class="fa fa-strikethrough"></i></li>');
  strikethroughButton.on("click", function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' ~~'+newText+'~~ ', "end");
    editor.focus();
  });
  return strikethroughButton;
};

//exports.makeLinkButton = function(editor, viewer) {
exports.makeLinkButton = function(editor) {
  var linkButton = $('<li class="editButton"><i class="fa fa-link"></i></li>');
  var linkFormOverlay = $('<div class="link-form-overlay"><form><label for="url">URL</label><input type="text" name="url"/><button type="submit">OK</button></form></div>');
  linkFormOverlay.prepend(
    exports.closeOverlayButton(
      linkFormOverlay,
      function() { linkFormOverlay.find('[name="url"]').val(''); }
    )
  );
  linkFormOverlay.on('submit', function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    linkFormOverlay.detach();
    editor.replaceSelection(' ['+newText+']('+
      linkFormOverlay.find('[name="url"]').val()+
      ') ', "end");
    editor.focus();
    return false;
  });
  linkButton.on("click", function() {
    $('body').append(linkFormOverlay);
  });
  return linkButton;
};

exports.closeOverlayButton = function(overlay, callback) {
  return $('<span class="close-wysiwyg-button">X</span>').click(
  function() {
    overlay.detach();
    callback = callback ? callback : function() {};
    callback();
  });
};

exports.createImageOverlay = function(editor) {
  var imageFormOverlay = $('<div class="image-form-overlay"></div>');

  var resetImageOverlay = function() {
    imageFormOverlay.html('');
    Views.selectComponent({}, function(form) {
      imageFormOverlay
        .append(closeOverlayButton)
        .append(form)
        .append(newImageButton);
    },
    imageFormCallback,
    { type: 'image' }
    );
  };

  var closeOverlayButton = exports.closeOverlayButton(imageFormOverlay, resetImageOverlay);

  var newImageButton = $('<button class="new-image">New Image</button>').click(function() {
    Views.createImageForm({},
      function(form) {
        imageFormOverlay.html('');
        imageFormOverlay.append(closeOverlayButton).append(form);
      },
      editImage
    );
  });

  var editImage = function() {
    Views.editImageForm({},
      function(form) {
        imageFormOverlay.detach().append(closeOverlayButton).append(form);
      },
      imageFormCallback
    );
  };

  var imageFormCallback = function(component) {
    editor.replaceSelection('!!['+component.slug+'] ', "end");
    editor.focus();
    imageFormOverlay.detach();
  };

  resetImageOverlay();

  return imageFormOverlay;
};

exports.addImageButton = function(editor) {
  var imageButton = $('<li class="editButton"><i class="fa fa-picture-o"></i></li>');
  var imageFormOverlay = exports.createImageOverlay(editor);
  imageButton.on("click", function() {
    $('body').append(imageFormOverlay);
  });

  return imageButton;
};

exports.addMininavButton = function(editor) {
  var mininavButton = $('<li class="editButton"><i class="fa fa-list"></i></li>');
  var mininavFormOverlay = exports.createMininavOverlay(editor);
  mininavButton.on("click", function() {
    $('body').append(mininavFormOverlay);
  });

  return mininavButton;
};

exports.createMininavOverlay = function(editor) {
  var mininavFormOverlay = $('<div class="mininav-form-overlay"></div>');

  var resetMininavOverlay = function() {
    mininavFormOverlay.html('');
    Views.selectComponent({}, function(form) {
      mininavFormOverlay
        .append(closeOverlayButton)
        .append(form)
        .append(newMininavButton);
    },
    mininavFormCallback,
    { type: 'mininav' }
    );
  };

  var closeOverlayButton = exports.closeOverlayButton(mininavFormOverlay, resetMininavOverlay);

  var newMininavButton = $('<button class="new-mininav">New Mininav</button>').click(function() {
    Views.createList({},
      function(form) {
        mininavFormOverlay.html('');
        mininavFormOverlay.append(closeOverlayButton).append(form);
      },
      editMininav
    );
  });

  var editMininav = function() {
    Views.editList({},
      function(form) {
        mininavFormOverlay.detach().append(closeOverlayButton).append(form);
      },
      mininavFormCallback
    );
  };

  var mininavFormCallback = function(component) {
    mininavFormOverlay.detach();
    editor.replaceSelection('!!['+component.slug+'] ', "end");
    editor.focus();
  };

  resetMininavOverlay();

  return mininavFormOverlay;
};
