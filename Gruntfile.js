module.exports = function (grunt) {
    // Do grunt-related things in here
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'), uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                build: {
                    src: 'javascript-inheritance.js',
                    dest: 'build/<%= pkg.name %>.min.js'
                }
            }, jasmine: {
                prototypal: {
                    src: 'javascript-inheritance.js',
                    options: {
                        specs: 'specs/PrototypalInheritanceSpec.js',
                        helpers: 'specs/SpecHelper.js',
                        junit: {
                            path: 'junit'
                        }
                    }
                },
                classical: {
                    src: 'javascript-inheritance.js',
                    options: {
                        specs: 'specs/ClassicalInheritanceSpec.js',
                        helpers: 'specs/SpecHelper.js',
                        junit: {
                            path: 'junit'
                        }
                    }
                }
            },
            jasmine_node: {
                coverage: {
                },
                options: {
                    forceExit: true,
                    match: '.',
                    matchall: false,
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    junitreport: {
                        report: false,
                        savePath: "./junit/coverage/",
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                all: ['specs/']
            }
            , 'jasmine-server': {
                browser: false
            },
            jshint: {
                all: ['*.js', 'specs/*.js'], options: {
                    jshintrc: '.jshintrc'
                }
            }
            , watch: {
                scripts: {
                    files: ['javascript-inheritance.js', 'specs/*.js'],
                    tasks: ['jshint', 'jasmine'],
                    options: {
                        spawn: false
                    }
                }
            }
        }
    )
    ;
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');

    grunt.registerTask('test', 'jasmine') ;
    grunt.registerTask('build', 'uglify') ;

    grunt.registerTask('default', ['jasmine', 'jshint', 'jasmine_node']) ;
}
;