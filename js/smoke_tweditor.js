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

exports.headerButton = function(editor, viewer) {
  var headerDropDown = $('<select class="headerDropDown">');
  var wrap = function(start, end) {
    end = end ? end : start;
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' '+start+newText+end+' ', "end");
    editor.focus();
  };
  var addHeader = function(size) {
    var cursorStart = editor.getCursor("start");
    var cursorEnd = editor.getCursor("end");
    for (var i = cursorStart.line; i<=cursorEnd.line; i++) {
      var line = editor.getLine(i);
      var tokens = exports.markdown.lexer(line);
      var newLine = Array();
      var hasHeader = false;
      tokens.forEach(function(val, index) {
        if (val.type === "blockquote_start") {
          newLine.push('> ');
        } else if (val.type === "heading") {
          newLine.push(Array(size+1).join('#')+val.text);
          hasHeader = true;
        } else if (val.type === "paragraph") {
          if (!hasHeader) {
            newLine.push(Array(size+1).join('#')+val.text);
            hasHeader = true;
          } else {
            newLine.push(val.text);
          }
        } else {
          newLine.push(val.text);
        }
      });
      editor.setLine(i, newLine.join(''));
    }
    editor.setSelection(cursorStart, cursorEnd);
    editor.focus();
  }
    /**
     * FIXME!!!
     * the types of styles i know about are
     * article lead { text-transform: uppercase; font-weight: bold; }
     * large subsection lead { font-size: 36px; font-family: 'bitter', serif'; margin .5em 0;}
     * small subsection lead { font-size: 36px; font-family: 'bitter', serif'; margin .5em 0;}
     * highlight {font-weight:bold; font-size: 1.4em;color: #e12300(red)}
     * subscript
     * superscript
     */
  var styles = {
    'article-lead' : function() {
      wrap('<span class="article-lead">', '</span>');
    },
  };
  for (var i in styles) { //start at 1, there is no h0
    headerDropDown.append($('<option>')
        .addClass(i)
        .attr('value', i)
        .text(styles[i]));
  }
  headerDropDown.on("change", function(e) {
  });
  var headerButton = $('<li class="editButton"></li>');
  headerButton.append(headerDropDown);
  return headerButton;
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
    imageFormOverlay.detach()
  };

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
}

exports.createMininavOverlay = function(editor) {
  var mininavFormOverlay = $('<div class="mininav-form-overlay"></div>');

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

  resetMininavOverlay();

  return mininavFormOverlay;
};
