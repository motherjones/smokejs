var $ = require('jquery');
exports.markdown = require('./marked');
var Codemirror = require('./codemirror');

exports.convert =  function(cm) {
  preview.html(exports.markedown(cm.getValue()));
};
exports.preview = $('<div class="html"></div>');
exports.menu =  $('<ul class="tweditorMenu"></ul>');

exports.tweditor = function(textarea_selector) {
  //Build Editor and Preview
  var textarea = $(textarea_selector);
  textarea.wrap('<div class="markdown"></div>');
  var editarea = textarea.parent();
  editarea.wrap('<div class="tweditor view-mode"></div>');
  var viewer = editarea.parent();
  editarea.after(exports.preview);
  //Build Menu
  var splitScreenButton = $('<li class="splitScreenButton"><i class="fa fa-expand"></i></li>');
  exports.menu.append(splitScreenButton);
  var editButton = $('<li class="editModeButton"><i class="fa fa-edit"></i></li>');
  exports.menu.append(editButton);
  var viewButton = $('<li class="viewModeButton"><i class="fa fa-eye"></i></li>');
  exports.menu.append(viewButton);
  exports.menu.append($('<li class="seperator">|</li>'));
  var boldButton = $('<li class="editButton"><i class="fa fa-bold"></i></li>');
  exports.menu.append(boldButton);
  var italicButton = $('<li class="editButton"><i class="fa fa-italic"></i></li>');
  exports.menu.append(italicButton);

  //Build Header Menu
  var headerDropDown = $('<select class="headerDropDown">')
  for (var i=0;i<6;i++) {
    if (i===0) {
      var val = '';
    } else {
      var val = 'H'+i;
    }
    headerDropDown.append($('<option>').attr('value', i).text(val));
  }
  var headerButton = $('<li class="editButton"></li>');
  headerButton.append(headerDropDown);
  exports.menu.append(headerButton);
  editarea.before(exports.menu);
  editor = CodeMirror.fromTextArea(textarea.get(0), {
    lineNumbers: true,
    lineWrapping: true,
    mode: "markdown"
  });
  editor.setSize(textarea.width(),textarea.height());
  editor.on("change", function(cm, changeObject) {
    exports.convert(cm);
  });
  exports.convert(editor);
  splitScreenButton.on("click", function() {
    viewer.addClass("fullscreen").removeClass("view-mode").removeClass("edit-mode");  
    editor.refresh(); //not documented
  });
  editButton.on("click", function() {
    viewer.removeClass("fullscreen").removeClass("view-mode").addClass("edit-mode");  
    editor.refresh();
  });
  viewButton.on("click", function() {
    viewer.removeClass("fullscreen").addClass("view-mode").removeClass("edit-mode");  
    editor.refresh();
  });
  italicButton.on("click", function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' *'+newText+'* ', "end");
    editor.focus();
  });
  boldButton.on("click", function() {
    var newText = editor.getSelection().replace('*', '', 'g');
    editor.replaceSelection(' **'+newText+'** ', "end");
    editor.focus();
  });
  headerDropDown.on("change", function(e) {
    var headerDepth = parseInt($(e.target).val());
    console.log(headerDepth);
    var cursorStart = editor.getCursor("start");
    var cursorEnd = editor.getCursor("end"); 
    for (var i = cursorStart.line; i<=cursorEnd.line; i++) {
      var line = editor.getLine(i);
      var tokens = exports.markedown.lexer(line);
      var newLine = Array();
      var hasHeader = false;
      tokens.forEach(function(val, index) {
        if (val.type === "blockquote_start") {
          newLine.push('> ');
        } else if (val.type === "heading") {
          newLine.push(Array(headerDepth+1).join('#')+val.text);
          hasHeader = true;
        } else if (val.type === "paragraph") {
          if (!hasHeader) {
            newLine.push(Array(headerDepth+1).join('#')+val.text);
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
  });
  return editor;
};
