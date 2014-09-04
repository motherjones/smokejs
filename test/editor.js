/*global require */

var editor = require('../js/editor');
var should = require('should');
var testData = require('./fixtures/article/1.json');
var testAuthorData = require('./fixtures/author/peter.json');
var $ = require('jquery');
var api = require('../js/edit_api');
var Promise = require('promise-polyfill');
var _ = require('lodash');
var utils = require('./utils');
var render = require('../js/render');

describe("editor functions", function() {
  describe("makeEditable", function() {
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
      var listEditableBackup = editor.makeListEditable;
      editor.makeListEditable = function(name) {
        editor.makeListEditable = listEditableBackup;
        name.should.eql('byline');
        done();
      };
      editor.makeEditable(component);
    });

    it("calls function to make metadata editable", function(done) {
      var metadataCalled = [];
      var editableMetadataBackup = editor.editableMetadata;
      editor.editableMetadata = function(comp, meta) {
        //This is called on the master image, too!!
        metadataCalled.push(meta);
      };

      editor.makeEditable(component);
      editor.editableMetadata = editableMetadataBackup;
      metadataCalled.should.containEql( "title" );
      metadataCalled.should.containEql( "social_title" );
      metadataCalled.should.containEql( "section" );
      metadataCalled.should.containEql( "tags" );
      metadataCalled.should.containEql( "dek" );
      done();
    });

    it("should call itself for each attribute", function(done) {
      var counter = 0;
      var makeEditableBak = editor.makeEditable;
      editor.makeEditable = function(component) {
        counter++;
        makeEditableBak(component);
      };
      editor.makeEditable(component);
      counter.should.eql(2);
        //expected make editable to be called for the article, master image
        //byline will not call makeEditable again as it is an array
      editor.makeEditable = makeEditableBak;
      done();
    });

    it("should add a save button to the page", function(done) {
      editor.makeEditable(component);
      $('#' + component.slug + ' button').length.should.not.eql(0);
      done();
    });

    after(function(done) {
      mockArticle.remove();
      done();
    });
  });

  describe("editableMetadata", function() {
    var component;
    var slug;
    var mockArticle;
    var mockDek;
    before(function(done){
      slug = 'test';
      component = new api.Component(slug, testData);

      mockArticle = $('<div id="' + slug + '"></div>');
      mockDek = $('<h1 data-metadata="dek" data-slug="' + slug + '">fake dek yo</h1>');
      mockArticle.append(mockDek);
      $('body').append(mockArticle);
      done();
    });

    it("should make a metadata element contentEditable", function(done) {
      editor.editableMetadata(component, 'dek');
      should(mockDek.attr('contentEditable')).eql('true');
      done();
    });

    it("should attach an on blur event to  metadata element which updates the component", function(done) {
      editor.editableMetadata(component, 'dek');
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


  describe("saveComponentButton", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var button = editor.saveComponentButton(component);

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
        return new Promise(function(resolve) {
         done();
         resolve();
        });
      };
      button.click();
    });

    it("should run success notification if component's update succeeds", function(done) {
      var sBak = editor.successNotice;
      editor.successNotice = function() {
        editor.successNotice = sBak;
        done();
      };
      component.update = function() {
        return new Promise(function(resolve, reject) { resolve(); });
      };
      button.click();
    });

    it("should call failure notification if component's update fails", function(done) {
      var fBak = editor.failureNotice;
      editor.failureNotice = function() {
        editor.failureNotice = fBak;
        done();
      };
      component.update = function() {
        return new Promise(function(resolve, reject) { reject(); });
      };
      button.click();
    });

  });

  describe("saveListButton", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var button = editor.saveListButton('byline', component);

    it("should create a button", function(done) {
      button.is('button').should.be.true;
      done();
    });

    it("should call the component's set attribute method on click", function(done) {
      component.setAttribute = function() {
        return new Promise(function(resolve) {
         done();
         resolve();
        });
      };
      button.click();
    });

    it("should run success notification if component's update succeeds", function(done) {
      var sBak = editor.successNotice;
      editor.successNotice = function() {
        editor.successNotice = sBak;
        done();
      };
      component.setAttribute = function() {
        return new Promise(function(resolve) { resolve(); });
      };
      button.click();
    });

    it("should call failure notification if component's update fails", function(done) {
      var fBak = editor.failureNotice;
      editor.failureNotice = function() {
        editor.failureNotice = fBak;
        done();
      };
      component.setAttribute = function() {
        return new Promise(function(resolve, reject) { reject(); });
      };
      button.click();
    });

  });

  describe("removeFromListButton", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var itemId = 'test_byline_item_removal';
    var ul = $('<ul data-attribute="byline"' +
        ' data-slug="' + component.slug + '"></ul>');
    var item = $('<li id="' + itemId + '" data-slug="peter-van-buren" >Mr. Pan, I presume</li>');
    var button = editor.removeFromListButton('peter-van-buren', 'byline', component);
    ul.append(item);
    $('body').append(ul);

    it("should create a button", function(done) {
      button.is('button').should.be.true;
      done();
    });

    it("before click the document should have the item", function(done) {
      $('#' + itemId).length.should.be.eql(1);
      done();
    });
    it("before click the array should have the item", function(done) {
      _.where(component.attributes.byline, {slug: 'peter-van-buren'}).length.should.eql(1);
      done();
    });

    it("on click it should should remove the button from the document", function(done) {
      button.click();
      $('#' + itemId).length.should.be.eql(0);
      done();
    });
    it("on click it should should remove the item from the array", function(done) {
      button.click();
      _.where(component.attributes.byline, {slug: 'peter-van-buren'}).length.should.eql(0);
      done();
    });
  });

  describe("makeListEditable", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var list = $('<ul data-attribute="byline" data-slug="'+slug+'"></ul>');
    var item = $('<li data-slug="peter-van-buren" >Mr. Pan, I presume</li>');
    var listSortedActionBak = editor.listSortedAction;

    before(function(done) {
      list.append(item);
      $('body').append(list);
      editor.makeListEditable('byline', component);
      done();
    });

    it("should make the li of a ul or ol be draggable", function(done) {
      item.attr('draggable').should.eql('true');
      done();
    });

    it("should add a remove button to the uls list items", function(done) {
      item.find('button').length.should.eql(1);
      done();
    });

    it("should add an 'add to list' button and a 'save this list button' to the ul", function(done) {
      list.children('button').length.should.eql(2, 'add to list button not implemented yet');
      done();
    });

    it("should run the list sorted function the list is sorted", function(done) {
      editor.listSortedAction = function() {
        done();
      };
      list.trigger('sortupdate');
    });

    after(function(done) {
      list.remove();
      editor.listSortedAction = listSortedActionBak;
      done();
    });

  });
  describe("listSortedAction", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var list = $('<ul data-attribute="byline" data-slug="'+slug+'"></ul>');
    var item = $('<li data-slug="peter-van-buren" >Mr. Pan, I presume</li>');
    var secondItem = $('<li data-slug="henry-the-eighth" >i am i am</li>');
    var henry = testData.attributes.byline[0]; //TODO: Clone here and fix consiquences

    before(function(done) {
      list.append(item);
      list.append(secondItem);
      $('body').append(list);

      henry.slug = 'henry-the-eighth';  //TODO: This current change all instances of testData
      component.attributes.byline.unshift(henry);
      done();
    });

    it("before sorted action Henry is before Pete", function(done) {
      _.findIndex(component.attributes.byline, function(author) {
        return author.slug === 'henry-the-eighth';
      }).should.eql('0');
      _.findIndex(component.attributes.byline, function(author) {
        return author.slug === 'peter-van-buren';
      }).should.eql('1');
      done();
    });

    it("should set a list attribute to an order based on an html list", function(done) {
      editor.listSortedAction(list, component);

      _.findIndex(component.attributes.byline, function(author) {
        return author.slug === 'henry-the-eighth';
      }).should.eql('1');
      _.findIndex(component.attributes.byline, function(author) {
        return author.slug === 'peter-van-buren';
      }).should.eql('0');
      done();
    });

    after(function(done) {
      list.remove();
      done();
    });
  });

  describe("add to list button", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var button = editor.addToListButton('byline', component);
    var addToListFormBak = editor.addToListForm;

    it("should create a button", function(done) {
      button.is('button').should.be.true;
      done();
    });

    it("becomes disabled after being clicked", function(done) {
      button.click();
      button.prop('disabled').should.be.true
      done();
    });

    it("when the button is clicked it should run the func to create a form", function(done) {
      editor.addToListForm = function() {
        done();
      };
      button.click();
    });

    after(function(done) {
      editor.addToListForm = addToListFormBak;
      done();
    });
  });

  describe("add to list form", function() {
    var slug = 'test';
    var component = new api.Component(slug, testData);
    var button = $('<button></button>');
    var form = editor.addToListForm('byline', component, button);
    var cancel = form.find('.cancel');
    var addItemBak = editor.addItemToList;
    $('body').append(button).append(form);

    it('creates a form', function(done) {
      form.is('form').should.be.true;
      done();
    });
    it('should run add to list on submit', function(done) {
      editor.addItemToList = function() {
        done();
      };
      form.submit();
    });
    it('should make the button which made it no longer disabled on submit', function(done) {
      editor.addItemToList = function() {};
      button.prop('disabled', true);
      button.prop('disabled').should.be.true;
      form.submit();
      button.prop('disabled').should.be.false;
      done();
    });

    it('has a cancel button', function(done) {
      cancel.length.should.eql(1);
      done();
    });
    it('cancel button should make the button which made the form no longer disabled on submit, and remove the form from the page', function(done) {
      button.prop('disabled', true);
      $('form').length.should.eql(1);
      button.prop('disabled').should.be.true;
      cancel.click();
      button.prop('disabled').should.be.false;
      $('form').length.should.eql(0);
      done();
    });
    after(function(done) {
      editor.addItemToList = addItemBak;
      form.remove();
      button.remove();
      done();
    });
  });
  describe("add to list", function() {
    var slug = 'test';
    var authorSlug = 'peter';
    var component, list, item, button, form;
    var fakeServer;
    before(function(done) {
      $('body').html('');
      fakeServer = utils.mock_component(authorSlug, testAuthorData);
      done();
    });
    beforeEach(function(done) {
      list = $('<ul data-template="byline" data-attribute="byline" data-slug="'+slug+'"></ul>');
      item = $('<li data-slug="henry-the-eighth" >ZZzzzZZzzzZZz</li>');
      button = $('<button disabled="true">add! or save! whatever</button>');
      form = $('<form><input name="slug" value="' + authorSlug + '"></input></form>');
      list.append(item);
      list.append(button);
      list.append(button);
      list.append(form);
      $('body').append(list)
      component = new api.Component(slug, testData);
      done();
    });
    afterEach(function(done) {
      $('body').html('')
      list.remove();
      done();
    });
    after(function(done) {
      fakeServer.restore();
      done();
    });
    it('disables the add item form', function(done) {
      editor.addItemToList(form, 'byline', component).then(function() {
        form.prop('disabled').should.be.true;
        done();
      });
    });
    it('adds a rendered li to the end of list, based on the attribute type', function(done) {
      editor.addItemToList(form, 'byline', component).then(function() {
        list = $('[data-template="byline"][data-attribute="byline"][data-slug="'+slug+'"]');
        list.find('li:first-of-type').data('slug').should.eql('henry-the-eighth');
        list.find('li:last-of-type').data('slug').should.eql('peter');
        done();
      });
    });
    it('adds the component to the component\'s attribute in the last position', function(done) {
      editor.addItemToList(form, 'byline', component).then(function() {
        component.attributes.byline[component.attributes.byline.length - 1]
          .slug.should.eql('peter');
        done();
      });
    });
    it('removes the form that called this function', function(done) {
      editor.addItemToList(form, 'byline', component).then(function() {
        $('form').length.should.eql(0);
        done();
      });
    });
    it('re-enables the buttons attached to the list (add, save)', function(done) {
      button.prop('disabled').should.be.true;
      editor.addItemToList(form, 'byline', component).then(function() {
        $('ul > button').each(function() {
          $(this).prop('disabled').should.be.false;
        })
        done();
      });
    });
  });
  describe("remake lists", function() {
    var slug = 'test';
    var makeListsEditableCalled;
    var component, list, secondList;
    var makeListEditableBak = editor.makeListEditable;
    before(function(done) {
      editor.makeListEditable = function(attribute, component) {
        attribute.should.be.eql('byline');
        component.slug.should.eql(slug);
        makeListsEditableCalled += 1;
      };
      done();
    });
    beforeEach(function(done) {
      makeListsEditableCalled = 0;
      $('body').html('');
      component = new api.Component(slug, testData);
      var params = {
        slug: component.slug,
        items: component.attributes['byline'],
        template: 'byline',
        attribute: 'byline'
      };
      render.render('sortable_list', params, function(html) {
        $('body').append($(html));
        $('li').length.should.eql(1);
        params.template = 'author-bio';
        render.render('sortable_list', params, function(html) {
          $('body').append($(html));
          $('li').length.should.eql(2);
          done();
        });
      });
    });
    it('remakes all lists based on the most recent component data', function(done) {
      component.attributes.byline.pop();
      editor.remakeLists(component, 'byline').then(function() {
        $('li').length.should.eql(0);
        done();
      });
    });
    it('remakes each list with list using the right template', function(done) {
      editor.remakeLists(component, 'byline').then(function() {
        $('[data-template="byline"] a').attr('href').should.eql('/author/henry-the-eighth');
        should($('[data-template="author-bio"] div').hasClass('author-bio')).eql(true);
        done();
      });
    });
    it('calls out to make the lists editable after render', function(done) {
      editor.remakeLists(component, 'byline').then(function() {
        makeListsEditableCalled.should.eql(1);
        done();
      });
    });
    afterEach(function(done) {
      $('body').html('');
      done();
    });
    after(function(done) {
      editor.makeListEditable = makeListEditableBak;
      done();
    });
  });
});
