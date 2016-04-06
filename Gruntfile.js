module.exports = function(grunt, type) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      src: ["cloud/**/*.js"]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('gruntify-eslint');

  grunt.registerTask('default', ['eslint']);
};