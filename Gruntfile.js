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
      }    },
    browserify: {
        dist: {
            files: {
                'build/js/smoke.js': ['dev/js/main.js']
            }
        },
        test: {
            files: {
                'build/test/smoke_test.js': ['dev/test/all.js']
            }
        },
    },
    less: {
      development: {
        files: {
          "build/css/<%= pkg.name %>.css": "dev/css/**/*.less"
        }
      },
      production: {
        options: {
          yuicompress: true
        },
        files: {
          "build/css/<%= pkg.name %>.min.css": "dev/css/*.less"
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'build/js/smoke.js',
        dest: 'build/js/smoke.min.js'
      },
    },
    qunit: {
        all: {
          options: {
            urls: [
              'http://localhost:9001/smoke_test.html'
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
        src: ['dev/js/**/*.js', '!dev/js/libs/**/*.js']
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
        cwd: 'build/css/',
        src: ['/*.css',],
        dest: 'build/css',
        ext: '.css'
      },
    },
    connect: {
        server: {
            options: {
                port: 9001,
                base: 'build',
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
    htmlmin: { 
        build: {
            options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: {
                'build/index.html': 'dev/index.html',     // 'destination': 'source'
                'build/smoke_test.html': 'dev/test/smoke_test.html',     // 'destination': 'source'
            }
        }
    },
    dust: {
        defaults: {
            files: {
                'build/js/dust_templates.js': ["dev/templates/**/*.dust"]
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
      html: {
        files: 'dev/**/*.html',
        tasks: ['htmlmin']
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
  grunt.loadNpmTasks('grunt-dust');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', ['dust', 'jshint', 'qunit', 'browserify', 'concat', 'uglify', 'less', 'htmlmin']);
  grunt.registerTask('min', ['dust', 'browserify', 'concat', 'uglify', 'cssmin', 'htmlmin']);
  grunt.registerTask('test', ['browserify:test', 'connect', 'qunit', 'htmlmin']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('css', ['less', 'cssmin']);
  grunt.registerTask('fab', ['dust', 'browserify', 'concat', 'uglify', 'less', 'cssmin', 'htmlmin' ]);
  grunt.registerTask('serve', ['dust', 'browserify', 'less:development', 'htmlmin', 'connect', 'watch']);

};
