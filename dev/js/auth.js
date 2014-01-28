/*global module */
'use strict';

module.exports = (function() {
    var Backbone = require('backbone');
    Backbone.$ = require('jquery-browserify');


    var AuthModel = Backbone.Model.extend({
        initialize: function() {
        },
        defaults : {
            user: 'guest',
            username: 'Guest',
            password: '',
            can_edit: true, //FIXME OH GOD NO
            can_admin : true,
        },
    });

    var AuthView = Backbone.View.extend({
        initialize: function() {
            this.model.on('change:username', this.check_auth);
            this.model.on('change:password', this.check_auth);
        },
        check_auth: function() {
            // get mirror's public key
            // encrypt username and password
            // pass encrypted username/password
            // set is admin and is editor 
        },
        render : function() {
             // make login form
        }
    });
    var auth_model = new AuthModel();
    var auth_view = new AuthView({ model: auth_model });

    return auth_view;

})();
