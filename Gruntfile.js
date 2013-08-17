module.exports = function(grunt) {
    // Do grunt-related things in here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , jasmine: {
            prototypal: {
                src: 'javascrpt-inheritance.js',
                options: {
                    specs: 'specs/PrototypalInheritanceSpec.js',
                    helpers: 'spec/SpecHelper.js',
                    junit: {
                        path: 'junit'
                    }
                }
            }
            , classical : {
                src: 'javascrpt-inheritance.js',
                options: {
                    specs: 'specs/ClassicalInheritanceSpec.js',
                    helpers: 'spec/SpecHelper.js',
                    junit: {
                        path: 'junit'
                    }
                }
            }
        }
        , 'jasmine-server' : {
            browser : false
        }
    }) ;

    grunt.loadNpmTasks('grunt-contrib-jasmine');


    // Default task.
    grunt.registerTask('default', 'jasmine');
};