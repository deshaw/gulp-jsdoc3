'use strict'; // eslint-disable-line

let gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha');

const srcCode = ['./src/**/*.js'];
const specs = ['./test/**/*_spec.js'];
const lintedFiles = ['*.js', './test/**/*.js', '!./test/docs/**/*.js'].concat(srcCode);

// No real need to have a minify set for now, let dev and prod builds be the same
gulp.task('build', function () {
    return gulp.src(srcCode)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src('./src/jsdocConfig.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
    return gulp.src(lintedFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('watch-lint', function () {
    let runSequence = require('run-sequence');

    runSequence('lint', function () {
        gulp.watch(lintedFiles, ['lint']);
    });
});

// We do this over using include/exclude to make everything feel gulp-like!
gulp.task('doc', function (cb) {
    let jsdoc = require('./index');

    let config = require('./src/jsdocConfig');
    gulp.src(['README.md'].concat(srcCode), {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('pre-test', function () {
    // Everything file loaded from here uses babel with .babelrc
    require('babel-core/register'); // https://babeljs.io/docs/usage/require/

    return gulp.src(srcCode)
        // Covering files (we use isparta for babel support)
        .pipe(istanbul({instrumenter: require('isparta').Instrumenter}))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    // Everything file loaded from here uses babel with .babelrc
    require('babel-core/register'); // https://babeljs.io/docs/usage/require/

    return gulp.src(specs, {read: false})
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({thresholds: {global: 75}}));
});

gulp.task('default', function (cb) {
    let runSequence = require('run-sequence');
    runSequence('copy', 'build', 'doc', cb);
});
