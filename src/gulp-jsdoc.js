import map from 'map-stream';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';
import gutil from 'gulp-util';
import Promise from 'bluebird';
var os = require('os').type();

var debug = require('debug')('gulp-jsdoc3');

/**
 * @callback gulpDoneCallback
 */

/**
 * A wrapper aropund jsdoc cli.
 *
 * This function collects all filenames. Then runs:
 * ```jsdoc -c config -t node_modules/ink-docstrap/template gulpFile1 gulpFile2```
 * @example
 * gulp.src(['README.md', 'src/*.js']), {read: false}).pipe(
 *     jsdoc(options, cb)
 * );
 *
 * @param {Object} config
 * @param {gulpDoneCallback} done
 * @returns {*|SignalBinding}
 */
export function jsdoc(config, done) {
    var files = [];

    // Prevent some errors
    if (typeof done !== 'function') {
        done = function () {
        };
    }

    debug('Config:\n' + JSON.stringify(config, undefined, 2));

    return map(function (file, callback) {
        files.push(file.path);
        callback(null, file);
    }).on('end', function () {
        // We use a promise to prevent multiple dones (normal cause error then close)
        new Promise(function (resolve, reject) {
            if (files.length === 0) {
                const errMsg = 'JSDoc Error: no files found to process';
                gutil.log(gutil.colors.red(errMsg));
                gutil.beep();
                reject(new Error(errMsg));
            }

            const tmpobj = tmp.fileSync();

            debug('Documenting files: ' + files.join(' '));
            fs.writeFile(tmpobj.name, JSON.stringify(config), 'utf8', function (err) {
                // We couldn't write the temp file
                if (err) {
                    reject(err);
                }

                const spawn = require('child_process').spawn,
                    cmd = require.resolve('jsdoc/jsdoc.js'), // Needed to handle npm3 - find the binary anywhere
                    inkdocstrap = path.dirname(require.resolve('ink-docstrap'));
                // Config + ink-docstrap
                const args = ['-c', tmpobj.name, '-t', inkdocstrap].concat(files);

                debug(cmd + ' ' + args.join(' '));

                const child = os === 'Windows_NT'
                    ? spawn(process.execPath, [cmd].concat(args), {cwd: process.cwd()})
                    : spawn(cmd, args, {cwd: process.cwd()}); // unix
                child.stdout.setEncoding('utf8');
                child.stderr.setEncoding('utf8');
                child.stdout.on('data', function (data) {
                    gutil.log(data);
                });
                child.stderr.on('data', function (data) {
                    gutil.log(gutil.colors.red(data));
                    gutil.beep();
                });
                child.on('close', function (code) {
                    if (code === 0) {
                        gutil.log('Documented ' + files.length + ' files!');
                        resolve();
                    } else {
                        gutil.log(gutil.colors.red('JSDoc returned with error code: ' + code));
                        gutil.beep();
                        reject(new Error('JSDoc closed with error code: ' + code));
                    }
                });
                child.on('error', function (error) {
                    gutil.log(gutil.colors.red('JSDoc Error: ' + error));
                    gutil.beep();
                    reject(new Error(error));
                });
            });
        }).then(result => done(result)).catch(err => done(err));
    });
}
