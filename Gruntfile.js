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
          '!**/js/**'
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
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "src/js/app.js",
          out: "dist/js/app.js",
          name: "almond"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('build', [
    'clean',
    'copy',
    'requirejs',
    'compass:dist'
  ]);
};
