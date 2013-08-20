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
                },
                coverage: {
                    src: ['javascript-inheritance.js'],
                    options: {
                        specs: ['specs/*.js'],
                        template: require('grunt-template-jasmine-istanbul'),
                        templateOptions: {
                            coverage: 'junit/coverage/coverage.json',
                            report: 'junit/coverage',
                            thresholds: {
                                lines: 90,
                                statements: 90,
                                branches: 75,
                                functions: 100
                            }
                        }
                    }
                }
            },
            jasmine_node: {
                coverage: {
                    savePath: "./junit/coverage/"
                },
                options: {
                    //forceExit: true,
                    //match: './',
                    //matchall: false,
                    //extensions: 'js',
                    //specNameMatcher: 'spec',
                    //junitreport: {
                        //report: false,
                        //useDotNotation: true,
                        //consolidate: true
                    //}
                    //, excludes: ['**/specs/**']
                }
                //
                //projectRoot: './',
                //specFolders: ['specs'],
                //useHelpers: false,
                //verbose: true,
                //colors: true,
                //all: ['specs/']
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