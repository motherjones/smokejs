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
        },
        test: {
            files: {
                'dev/test/smoke_test.js': ['dev/test/js/all.js']
            }
        },
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
        src: ['dev/js/**/*.js', '!dev/js/libs/**/*.js', '!dev/js/dust_templates.js']
      },
      test: {
        options: {
          jshintrc: 'dev/test/.jshintrc'
        },
        src: ['dev/test/js/*.js']
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
    dust: {
        defaults: {
            files: {
                'dev/js/dust_templates.js': ["dev/templates/**/*.dust"]
            },
            options: {
                runtime: false,
                basePath: 'dev/templates',
                wrapper: 'commonjs',
                  wrapperOptions: {
                    returning: "dust",
                    deps: {
                      dust: "dustjs-linkedin"
                    }
                  }

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
        tasks: ['jshint:src', 'browserify', 'qunit']
      },
      templates: {
        files: 'dev/templates/**/*.dust',
        tasks: ['dust', 'browserify', 'qunit']
      },
      css: {
        files: 'dev/css/**/*.less',
        tasks: ['less:development']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'browserify:test', 'qunit']
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
  grunt.loadNpmTasks('grunt-dust');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', ['dust', 'jshint', 'qunit', 'browserify', 'concat', 'uglify', 'less', 'smoosher', 'htmlmin']);
  grunt.registerTask('min', ['dust', 'browserify', 'concat', 'uglify', 'cssmin', 'htmlmin']);
  grunt.registerTask('test', ['browserify:test', 'connect', 'qunit']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('css', ['less', 'cssmin']);
  grunt.registerTask('fab', ['dust', 'browserify', 'concat', 'uglify', 'less', 'cssmin', 'smoosher', 'htmlmin']);
  grunt.registerTask('serve', ['dust', 'browserify', 'less:development', 'connect', 'watch']);

};
