'use strict';
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      }
    },
    browserify: {
      dist: {
        files: { 'build/js/smoke.js': ['dev/js/main.js'] },
        options: {
          bundleOptions: {
            debug: true
          }
        }
      },
      edit: {
        files: { 'build/js/smoke_edit.js': ['dev/js/main_edit.js'] },
        options: {
          bundleOptions: {
            debug: true
          }
        }
      },
      test: {
        files: { 'build/test/smoke_test.js': ['dev/test/all.js'] },
        options: {
          bundleOptions: {
            debug: true
          }
        }
      }
    },
    less: {
      development: {
        files: {
          'build/css/<%= pkg.name %>.css': [
            'dev/css/**/*.less',
            'dev/css/**/*.css'
          ]
        }
      },
      production: {
        options: { yuicompress: true },
        files: {
          'build/css/<%= pkg.name %>.min.css': [
            'dev/css/*.less',
            'dev/css/*.css'
          ]
        }
      }
    },
    uglify: {
      options: { banner: '<%= banner %>' },
      dist: {
        src: 'build/js/smoke.js',
        dest: 'build/js/smoke.min.js'
      },
      edit: {
        src: 'build/js/smoke_edit.js',
        dest: 'build/js/smoke_edit.min.js'
      }
    },
    shell: {
      testling: {
        command: function (browser) {
          if (browser == 'undefined') {
            return 'node_modules/.bin/browserify -t coverify dev/test/all.js | node_modules/.bin/testling | node_modules/.bin/coverify';
          } else if (browser == 'url') {
            return 'node_modules/.bin/browserify -t coverify dev/test/all.js | node_modules/.bin/testling -u';
          } else {
            return 'node_modules/.bin/browserify -t coverify dev/test/all.js | node_modules/.bin/testling -x "' + browser + '" | node_modules/.bin/coverify';
          }
        }
      }
    },
    jshint: {
      gruntfile: {
        options: { jshintrc: '.jshintrc' },
        src: 'Gruntfile.js'
      },
      src: {
        options: { jshintrc: 'dev/js/.jshintrc' },
        src: [
          'dev/js/**/*.js',
          '!dev/js/libs/**/*.js'
        ]
      },
      test: {
        options: { jshintrc: 'dev/test/.jshintrc' },
        src: [
          'dev/test/*.js',
          '!dev/test/libs/**/*.js'
        ]
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'build/css/',
        src: ['/*.css'],
        dest: 'build/css',
        ext: '.css'
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'build',
          middleware: function (connect, options) {
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
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'dev/index.html',
          'build/edit.html': 'dev/edit.html',
          'build/smoke_test.html': 'dev/test/smoke_test.html'
        }
      }
    },
    dust: {
      defaults: {
        files: {
          'build/js/dust_templates.js': [
            'dev/templates/**/*.dust',
            '!dev/templates/edit/**/*.dust'
          ]
        },
        options: {
          runtime: false,
          basePath: 'dev/templates',
          wrapper: 'commonjs',
          wrapperOptions: {
            returning: 'dust',
            deps: { dust: 'dustjs-linkedin' }
          }
        }
      },
      edit: {
        files: { 'build/js/edit_templates.js': [ 'dev/templates/**/*.dust' ]
        },
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: [
          'jshint:src',
          'browserify',
          'qunit'
        ]
      },
      templates: {
        files: 'dev/templates/**/*.dust',
        tasks: [
          'dust',
          'browserify',
          'qunit'
        ]
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
        tasks: [
          'jshint:test',
          'browserify:test',
          'qunit'
        ]
      }
    }
  });
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-dust');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', [
    'dust',
    'jshint',
    'browserify',
    'concat',
    'uglify',
    'less',
    'htmlmin',
    'connect'
  ]);
  grunt.registerTask('min', [
    'dust',
    'browserify',
    'concat',
    'uglify',
    'cssmin',
    'htmlmin'
  ]);
  grunt.registerTask('test', function (browser) {
    grunt.task.run('dust', 'shell:testling:' + browser);
  });
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('css', [
    'less',
    'cssmin'
  ]);
  grunt.registerTask('fab', [
    'dust',
    'browserify',
    'concat',
    'uglify',
    'less',
    'cssmin',
    'htmlmin'
  ]);
  grunt.registerTask('serve', [
    'dust',
    'browserify',
    'less:development',
    'htmlmin',
    'connect',
    'watch'
  ]);
};
