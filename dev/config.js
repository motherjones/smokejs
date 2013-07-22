require.config({
    paths: {
        jquery: 'libs/jquery-1.9.1.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        dust: 'libs/dust-full-1.2.3.min',
        /*
        hallo: 'libs/hallo',
        rangy: 'libs/rangy-core-1.2.3',
        */
        application: 'application',
        templates: 'templates',
        blowfish: 'libs/blowfish',
        config: '../prod_config',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery', ],
            exports: "Backbone",
        },
        /*
        'hallo': {
            deps: ['jquery', 'rangy',],
            attach: 'jQuery',
        },
        */
        'underscore': {
            exports: '_',
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
