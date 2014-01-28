'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['dev/js/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
    },
    browserify: {
        dist: {
            files: {
                'dev/smoke.js': ['dev/js/main.js']
            }
        }
    },
    less: {
      development: {
        files: {
          "dev/css/<%= pkg.name %>.css": "dev/css/**/*.less"
        }
      },
      production: {
        options: {
          yuicompress: true
        },
        files: {
          "dist/css/<%= pkg.name %>.css": "dev/css/*.less"
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
    },
//    qunit: {
//      all: ['dev/test/**/*.html']
//    },
    qunit: {
        all: {
          options: {
            urls: [
              'http://localhost:9001/test/smoke_test.html'
            ]
          }
        }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'dev/js/.jshintrc'
        },
        src: ['dev/js/**/*.js', '!dev/js/libs/**/*.js', '!dev/js/templates.js']
      },
      test: {
        options: {
          jshintrc: 'dev/test/.jshintrc'
        },
        src: ['dev/test/*.js']
      },
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dev/css/',
        src: ['/*.css',],
        dest: 'dist/css',
        ext: '.css'
      },
    },
    smoosher : {
        dev : {
            files : {
                'dist/inline.html' : ['dev/index.html']
            }
        },
        dist : {
            files: {
                'dist/inline.min.html' : ['dist/index.html']
            }
        }
    },
    htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true,
          },
          files: { 
              'dist/smallest.html': 'dist/inline.min.html'
          },
        },
    },
    connect: {
        server: {
            options: {
                port: 9001,
                base: 'dev',
                middleware: function(connect, options) {
                    var less = require('less-middleware');
                    return [
                        less({ src: options.base }),
                        connect.static(options.base),
                        connect.directory(options.base)
                    ];
                }
            }
        }
    },
    dustjs: {
      compile: {
        files: {
          'dev/js/templates.js': ["dev/templates/**/*.dust"]
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit', 'browserify']
      },
      templates: {
        files: 'dev/templates/**/*.dust',
        tasks: ['dustjs', 'qunit']
      },
      css: {
        files: 'dev/css/**/*.less',
        tasks: ['less:development']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-html-smoosher');
  grunt.loadNpmTasks('grunt-dustjs');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', ['dustjs', 'jshint', 'qunit', 'browserify', 'concat', 'uglify', 'less', 'smoosher', 'htmlmin']);
  grunt.registerTask('min', ['dustjs', 'browserify', 'concat', 'uglify', 'cssmin', 'htmlmin']);
  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('css', ['less', 'cssmin']);
  grunt.registerTask('dust', ['dustjs']);
  grunt.registerTask('fab', ['dustjs', 'browserify', 'concat', 'uglify', 'less', 'cssmin', 'smoosher', 'htmlmin']);
  grunt.registerTask('serve', ['dustjs', 'browserify', 'less', 'connect', 'watch']);

};
