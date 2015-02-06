var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    filelog = require('gulp-filelog'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    coveralls = require('gulp-coveralls'),
    options =  {
        globals: {
            exports: true,
            console: true,
            DEBUG: true,
            window: true
        },
        laxcomma: true,
        strict: false,
        validthis: true,
        undef: true
    };

gulp.task('default', function () {
    gulp.src('javascript-inheritance.js')
        .pipe(filelog())
        .pipe(jshint(options))
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename('javascript-inheritance.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('lint', function() {
    return gulp.src('javascript-inheritance.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    var karma = require('karma').server;

    karma.start({
        autoWatch: false,
        browsers: [
            'PhantomJS'
        ],
        coverageReporter: {
            type : 'lcov',
            dir : 'coverage/'
        },
        frameworks: [
            'jasmine'
        ],
        files: [
            'javascript-inheritance.js',
            'tests/spec-helper.js',
            'tests/prototypal-inheritance.spec.js',
            'tests/classical-inheritance.spec.js'
        ],
        junitReporter: {
            outputFile: 'target/junit.xml'
        },
        preprocessors: {
            'javascript-inheritance.js': 'coverage'
        },
        reporters: [
            'junit',
            'coverage'
        ],
        singleRun: true
    });
});

gulp.task('coveralls', ['test'], function () {
    gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());
});
