require.config({
    config: {
        DATA_STORE : 'http://localhost:8000/api/', // for testing, real datastore will be our api
        ERROR_HANDLER : function(err) { console.log(err); },
    },
    paths: {
        jquery: 'libs/jquery-1.9.1.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        dust: 'libs/dust-full-1.2.3.min',
        application: 'application'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
            init: function() {
                require(['js/libs/backbone-tastypie.js']);
            },
        },
        'underscore': {
            exports: '_'
        },
        'dust': {
            exports: 'dust',
            init: function() {
                require(['templates']);
            },
        },
        'templates': {
            deps: ['dust',],
        },
    }
});


