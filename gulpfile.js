'use strict'; // eslint-disable-line

let gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    log = require('fancy-log'),
    gulpIf = require('gulp-if');


const srcCode = ['./src/**/*.js'];
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
    const fix = process.argv.indexOf('--fix') !== -1;
    const task = gulp.src(lintedFiles)
        .pipe(eslint({fix}))
        .pipe(gulpIf((file) => {
            if (file.eslint && file.eslint.fixed) {
                log('[gulp][eslint]', `Fixed ${file.path}`);
                return true;
            }
            return false;
        }, gulp.dest((file) => file.base)))
        .pipe(eslint.format());
    // Let watch lint keep going
    if (process.argv.indexOf('watch-lint') === -1) {
        return task.pipe(eslint.failOnError());
    }
    return task;
});

gulp.task('watch-lint', gulp.series([
    'lint',
    function watching() {
        return gulp.watch(
            lintedFiles, gulp.series(['lint'])
        );
    }
])
);

// We do this over using include/exclude to make everything feel gulp-like!
gulp.task('doc', function (cb) {
    let jsdoc = require('./index');

    let config = require('./src/jsdocConfig');
    gulp.src(['README.md'].concat(srcCode), {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('default', gulp.series('copy', 'build', 'doc'));
