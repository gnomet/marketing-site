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
      temp: ['.build-tmp/'],
      package: ['dist-packaged/']
    },
    copy: {

      // Copy files to temporary location
      temp: {
        expand: true,
        cwd: 'src/',
        src: ['**'],
        dest: '.build-tmp/'
      },

      // Copy files from temporary location to the `dist` directory
      dist: {
        expand: true,
        cwd: '.build-tmp/',
        src: [
          '**',

          // These are packaged by RequireJS.
          '!**/js/almond*.js',
          '!**/js/app/**',

          '!**/sass/**', // SASS source is not needed. Only CSS.
          '!**/vendor/**', // These are included by SASS and RequireJS
          '!**/templates/**', // Templates are bundled with RequireJS package
        ],
        dest: 'dist/'
      },

      // Copy uncompressed image filed to `dist-packaged`. All other files are copies by the
      // compress task
      package: {
        expand: true,
        cwd: 'dist/',
        src: [
          '**/images/*',
        ],
        dest: 'dist-packaged/'
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

      // WARNING! Do NOT use expand: true in filerev task. It seems to be unable to delete
      // the originals if expand is true
      images: { src: '.build-tmp/images/*' },
      icons: { src: '.build-tmp/images/icons/*' },
      svg: { src: '.build-tmp/images/svg/*' },
      css: { src: '.build-tmp/css/*' },
      js: { src: '.build-tmp/js/*' },
      fonts: { src: ['.build-tmp/fonts/webfonts/*'] }
    },
    usemin: {
      html: '.build-tmp/*.html',
      css: '.build-tmp/css/style.*.css'
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
      },
      version: {
        src: ['.build-tmp/*.html'],
        overwrite: true,
        replacements: [{
          from: '<!-- VERSION -->',
          to: function() {
            return '<!-- VERSION ' + new Date() + ' -->';
          }
        }]
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, cwd: 'dist/', src: [
            '*.html',
            'js/*',
            'css/*',
            'fonts/**/*',
            'images/svg/*',
            'images/icons/*'
          ], dest: 'dist-packaged/'}
        ]
      }
    },
    aws: grunt.file.readJSON('aws-keys.json'),
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      staging: {
        options: {
          bucket: 'www.sharetri.be',
          differential: false // Only uploads the files that have changed (this is now disabled. seems to be a good idea, but didn't seem to work that well)
        },
        files: [
          // Cleanup all old files. If differential: true, this deletes only
          // files that do not exists locally
          {cwd: 'dist-packaged/', dest: '/', action: 'delete'},

          // Compressed files with long cache expiration
          {expand: true, cwd: 'dist-packaged/', src: [
            'js/*',
            'css/*',
            'images/svg/*',
            'images/icons/*',
            'fonts/**/*'
          ], dest: '', params: {
            ContentEncoding: "gzip",
            CacheControl: "max-age=" + 3600 * 24 * 365 + "" // One year
          }},

          // Not compressed filed with long cache expiration
          {expand: true, cwd: 'dist-packaged/', src: ['images/*'], dest: '', params: {
            CacheControl: "max-age=" + 3600 * 24 * 365 + "" // One year
          }},

          // Compressed files without cache
          {expand: true, cwd: 'dist-packaged/', src: ['*.html'], dest: '', params: {
            ContentEncoding: "gzip"
          }},
        ]
      },
      production: {
        options: {
          bucket: 'www.sharetribe.com',
          differential: false // Only uploads the files that have changed (this is now disabled. seems to be a good idea, but didn't seem to work that well)
        },
        files: [
          // Cleanup all old files. If differential: true, this deletes only
          // files that do not exists locally
          {cwd: 'dist-packaged/', dest: '/', action: 'delete'},

          // Compressed files with long cache expiration
          {expand: true, cwd: 'dist-packaged/', src: [
            'js/*',
            'css/*',
            'fonts/**/*',
            'images/svg/*',
            'images/icons/*'
          ], dest: '', params: {
            ContentEncoding: "gzip",
            CacheControl: "max-age=" + 3600 * 24 * 365 + "" // One year
          }},

          // Not compressed filed with long cache expiration
          {expand: true, cwd: 'dist-packaged/', src: ['images/*'], dest: '', params: {
            CacheControl: "max-age=" + 3600 * 24 * 365 + "" // One year
          }},

          // Compressed files without cache
          {expand: true, cwd: 'dist-packaged/', src: ['*.html'], dest: '', params: {
            ContentEncoding: "gzip"
          }},
        ]
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
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-compress');

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
    'replace:version',
    'requirejs:compile',
    'replace:requirejs',
    'compass:dist',
    'filerev',
    'usemin',
    'copy:dist'
  ]);


  grunt.registerTask('package', [
    'compress',
    'copy:package'
  ]);

  grunt.registerTask('deploy', [
    'aws_s3'
  ]);
};
