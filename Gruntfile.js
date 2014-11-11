module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          sassDir: '.build-tmp/sass',
          cssDir: '.build-tmp/css',
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
      dist: ['dist/'],
      temp: ['.build-tmp/']
    },
    copy: {

      // Copy files to temporary location
      temp: {
        expand: true,
        cwd: 'src/',
        src: ['**'],
        dest: '.build-tmp/'
      },

      // Copy files from temporary location to the final destination
      dist: {
        expand: true,
        cwd: '.build-tmp/',
        src: [
          '**',
          '!**/sass/**', // SASS source is not needed. Only CSS.
          '!**/templates/**' // Templates are bundled with RequireJS package
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
        cwd: '.build-tmp',
        src: 'images/**/*',
        dest: '.build-tmp/'
      },
      css: {
        src: 'temp/css/*'
      },
      js: {
        src: 'temp/js/*'
      }
    },
    usemin: {
      html: '.build-tmp/*.html',
      css: '.build-tmp/css/style.css'
    },
    requirejs: {
      compile: {
        options: {
          mainConfigFile: ".build-tmp/js/app.js",
          out: ".build-tmp/js/app.js",
          include: "app",
          name: "almond",
          insertRequire: ['app/main']
        }
      }
    },
    replace: {
      requirejs: {
        src: ['.build-tmp/*.html'],
        overwrite: true,
        replacements: [{
          from: '<script data-main="js/app" src="vendor/require.js"></script>',
          to: '<script src="js/app.js"></script>'
        }]
      }
    }
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

  /**
    Task to build a distribution package. Outputs to `dist` directory.

    The main idea of the build is this:

    1. Copy all files from `src` to `.build-tmp`
    2. In the `.build-tmp` directory, do all the necessary minifications and revving
    3. Copy necessary files from `.build-tmp` to `dist`
  */
  grunt.registerTask('build', [
    'clean',
    'copy:temp',
    'requirejs:compile',
    'replace:requirejs',
    'compass:dist',
    'filerev',
    'usemin',
    'copy:dist'
  ]);
};
