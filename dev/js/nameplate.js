/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');
    var dust = require('./libs/dust/dust');


    var NameplateModel = Backbone.Model.extend({
        defaults: {
            title: 'Mother Jones',
            ad_block: 'An add or something goes here'
        }
    });

    var NameplateView = Backbone.View.extend({
        initialize: function() {
            this.model = new NameplateModel();
        },
        render: function() {
            var that = this;
            dust.render("nameplate", this.model.attributes, function(err, out) {
                if (err) {
                    //throw error
                    console.log(err);
                } else {
                    that.$el = that.el = out;
                }
            });
            return this;
        },
    });
    return { 
        'NameplateView': NameplateView,
        'NameplateModel': NameplateModel,
    };

})();

