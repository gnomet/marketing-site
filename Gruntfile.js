module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'dist/css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'src/css'
        }
      }
    },
    clean: {
      dist: ['dist/']
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'src/',
        src: [
          '**',
          '!**/sass/**',
          '!**/css/**',
          '!**/js/**',
          '!**/images/**'
        ],
        dest: 'dist/'
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['compass:dev']
      },
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      }
    },
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      images: {
        expand: true,
        cwd: 'src',
        src: 'images/**/*',
        dest: 'dist/'
      }
    },
    usemin: {
      html: 'dist/*.html',
      css: 'dist/css/style.css'
    },
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "src/js/app.js",
          out: "dist/js/app.js",
          include: "app",
          name: "almond",
          insertRequire: ['app/main']
        }
      }
    },
    replace: {
      requirejs: {
        src: ['dist/*.html'],
        overwrite: true,
        replacements: [{
          from: '<script data-main="js/app" src="vendor/require.js"></script>',
          to: '<script src="js/app.js"></script>'
        }]
      }
    },
    'filerev-fix': {
      target: {}   // <= needs to be defined
    }
  });

  /**
    filerev-fix is a custom task to fix an issue with `filerev` task.

    filerev task doesn't handle the working directory `cwd` very well. The cwd should be
    ignored from the `grunt.filerev.summary` object, which maps the original and the revved
    version of the file. This summary object is later used by the usemin task.
  */
  grunt.registerMultiTask('filerev-fix', 'Working dir', function() {
    function dropPrefix(str, prefix) {
      return str.slice(prefix.length);
    }

    grunt.filerev.summary = Object.keys(grunt.filerev.summary).reduce(function(files, key) {
      var dest = grunt.filerev.summary[key];
      var src = 'dist/' + dropPrefix(key, 'src/');

      files[src] = dest;
      return files;
    }, {});

    console.log(grunt.filerev.summary);
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-debug-task');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task(s).
  grunt.registerTask('build', [
    'clean',
    'copy',
    'requirejs',
    'replace',
    'compass:dist',
    'filerev',
    'filerev-fix',
    'usemin'
  ]);
};
