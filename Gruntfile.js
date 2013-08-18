module.exports = function(grunt) {
    // Do grunt-related things in here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , jasmine: {
            prototypal: {
                src: 'javascript-inheritance.js',
                options: {
                    specs: 'specs/PrototypalInheritanceSpec.js',
                    helpers: 'specs/SpecHelper.js',
                    junit: {
                        path: 'junit'
                    }
                }
            }
            , classical : {
                src: 'javascript-inheritance.js',
                options: {
                    specs: 'specs/ClassicalInheritanceSpec.js',
                    helpers: 'specs/SpecHelper.js',
                    junit: {
                        path: 'junit'
                    }
                }
            }
        }
        , 'jasmine-server' : {
            browser : false
        }
        , jshint: {
            all: ['*.js', 'specs/*.js']
            , options: {
                jshintrc: '.jshintrc'
            }
        }
    }) ;
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', 'jasmine');
    // Default task.
    grunt.registerTask('default', ['jasmine','jshint']);
};