/*global define */
'use strict';

(function(define) {

define([ 
        'underscore', 
        'jquery',
        'backbone',
        'blowfish',
    ], 
    function(_, $, Backbone) {
        var AuthModel = Backbone.Model.extend({
            initialize: function() {
            },
            defaults : {
                user: 'guest',
                username: 'Guest',
                password: '',
                is_editor: true, //FIXME OH GOD NO
                is_admin : true,
            },
        });

        var AuthView = Backbone.View.extend({
            initialize: function() {
                            console.log(this.model);
                this.model.on('change:username', this.check_auth);
                this.model.on('change:password', this.check_auth);
            },
            check_auth: function() {
                // get mirror's public key
                // encrypt username and password
                // pass encrypted username/password
                // set is admin and is editor 
            },
            can_edit: function(view) {
               //maybe do some other kinda check to see if they have specific privs
                return this.model.get('is_editor');
            },
            can_admin: function(view) {
               //maybe do some other kinda check to see if they have specific privs
                return this.model.get('is_admin');
            },
            render : function() {
                 // make login form
            }
        });
        var auth_model = new AuthModel;
        var auth_view = new AuthView({ model: auth_model });

        return auth_view;
    }
);

})(define);


