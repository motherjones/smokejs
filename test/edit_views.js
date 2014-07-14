/*global require */

var views = require('../js/edit_views');
var should = require('should');
var testData = require('./fixtures/article/1.json');
var $ = require('jquery');
var api = require('../js/edit_api');
var Promise = require('promise-polyfill');

describe("edit view functions", function() {
  describe("_makeEditable", function() {
    var component;
    var slug;
    var mockArticle;
    before(function(done){
      slug = 'test';
      component = new api.Component(slug, testData);

      should(component.slug).eql(slug);
      mockArticle = $('<div id="' + slug + '"></div>');

      $('body').append(mockArticle);
      done();
    });

    it("can tell if an attribute is an array", function(done) {
      var listEditableBackup = views._makeListEditable;
      views._makeListEditable = function(name) {
        views._makeListEditable = listEditableBackup;
        name.should.eql('byline');
        done();
      }
      views._makeEditable(component)
    });

    it("calls function to make metadata editable", function(done) {
      var metadataCalled = [];
      var editableMetadataBackup = views._editableMetadata;
      views._editableMetadata = function(comp, meta) {
        //This is called on the master image, too!!
        metadataCalled.push(meta);
      }

      views._makeEditable(component);
      views._editableMetadata = editableMetadataBackup;
      metadataCalled.should.containEql( "title" );
      metadataCalled.should.containEql( "social_title" );
      metadataCalled.should.containEql( "section" );
      metadataCalled.should.containEql( "tags" );
      metadataCalled.should.containEql( "dek" );
      done();
    });

    it("should call itself for each attribute", function(done) {
      var counter = 0;
      var _makeEditableBak = views._makeEditable;
      views._makeEditable = function(component) {
        counter++;
        _makeEditableBak(component);
      }
      views._makeEditable(component);
      counter.should.eql(2);
        //expected make editable to be called for the article, master image
        //byline will not call makeEditable again as it is an array
      views._makeEditable = _makeEditableBak;
      done();
    });

    it("should add a save button to the page", function(done) {
      views._makeEditable(component);
      $('#' + component.slug + ' button').length.should.not.eql(0);
      done();
    });

    after(function(done) {
      mockArticle.remove();
      done();
    });
  });

  describe("_editableMetadata", function() {
    var component;
    var slug;
    var mockArticle;
    var mockDek;
    before(function(done){
      slug = 'test';
      component = new api.Component(slug, testData);

      mockArticle = $('<div id="' + slug + '"></div>');
      mockDek = $('<h1 class="dek ' + slug + '">fake dek yo</h1>');
      mockArticle.append(mockDek);
      $('body').append(mockArticle);
      done();
    });

    it("should make a metadata element contentEditable", function(done) {
      views._editableMetadata(component, 'dek');
      should(mockDek.attr('contentEditable')).eql('true');
      done();
    });

    it("should attach an on blur event to  metadata element which updates the component", function(done) {
      views._editableMetadata(component, 'dek');
      mockDek.text('new data');
      mockDek.blur();
      component.metadata.dek.should.eql('new data');
      done();
    });

    after(function(done) {
      mockArticle.remove();
      done();
    });
  });


  describe("_createSaveButton", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var button = views._createSaveButton(component);

    it("should create a button", function(done) {
      button.is('button').should.be.true;
      done();
    });

    it("should create a button", function(done) {
      button.is('button').should.be.true;
      done();
    });

    it("should call the component's update method on click", function(done) {
      component.update = function() {
        return new Promise(function(resolve, reject) {
         done();
         resolve();
        });
      };
      button.click();
    });

    it("should run success notification if component's update succeeds", function(done) {
      var sBak = views._successNotice;
      views._successNotice = function() {
        views._successNotice = sBak;
        done();
      };
      component.update = function() {
        return new Promise(function(resolve, reject) { resolve(); });
      };
      button.click();
    });

    it("should call failure notification if component's update fails", function(done) {
      var fBak = views._failureNotice;
      views._failureNotice = function() {
        views._failureNotice = fBak;
        done();
      };
      component.update = function() {
        return new Promise(function(resolve, reject) { reject(); });
      };
      button.click();
    });

  });
});

