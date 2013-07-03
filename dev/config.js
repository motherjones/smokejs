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
        backbone_tastypie: 'libs/backbone-tastypie',
        blowfish: 'libs/blowfish',
        config: '../prod_config',
    },
    shim: {
        'backbone_tastypie': {
            deps: ['backbone', "underscore", 'jquery',],
            attach: 'Backbone',
        },
        'backbone': {
            deps: ['underscore', 'jquery', ],
            exports: "Backbone",
            init: function() {
                require(['backbone_tastypie']);
            },
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
