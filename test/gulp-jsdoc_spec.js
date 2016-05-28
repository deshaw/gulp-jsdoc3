/*eslint-env mocha */

import {jsdoc} from '../src/gulp-jsdoc';
import {expect} from 'chai';
import fs from 'fs'; // Should be chai-fs, but that does not work with our version of chai
import gulp from 'gulp';
import tmp from 'tmp';
import path from 'path';
import mockSpawn from 'mock-spawn';

let mySpawn = mockSpawn();

describe('gulp-jsdoc', function () {
    let config = {
        tags: {
            allowUnknownTags: true
        },
        source: {
            includePattern: '.+\\.js(doc|x)?$',
            excludePattern: '(^|\\/|\\\\)_'
        },
        opts: {
            destination: undefined
        },
        plugins: ['plugins/markdown'],
        templates: {
            cleverLinks: false,
            monospaceLinks: false,
            'default': {
                outputSourceFiles: true
            },

            path: 'ink-docstrap',
            theme: 'cerulean',
            navType: 'vertical',
            linenums: true,
            dateFormat: 'MMMM Do YYYY, h:mm:ss a'
        }
    };

    let tmpdir;
    beforeEach(function () {
        tmpdir = tmp.dirSync();
        config.opts.destination = tmpdir.name;
        delete config.templates.default.layoutFile;
    });

    describe('Success cases', function () {
        it('Should call done and document files', function (cb) {
            const done = function (err) {
                if (!err) {
                    const stats = fs.statSync(config.opts.destination);
                    expect(stats.isDirectory()).to.be.true;
                    expect(fs.readFileSync(config.opts.destination + '/modules.list.html', 'utf-8'))
                        .to.contain('JSDocTesting');
                    expect(fs.readFileSync(config.opts.destination + '/module-JSDocTesting.html', 'utf-8'))
                        .to.contain('inputDataHere');
                }

                cb(err);
            };
            gulp.src([__dirname + '/testFile.js']).pipe(jsdoc(config, done));
        });

        it('Should call done only once when documenting multiple files', function (cb) {
            const done = function (err) {
                if (!err) {
                    const stats = fs.statSync(config.opts.destination);
                    expect(stats.isDirectory()).to.be.true;
                    expect(fs.readFileSync(config.opts.destination + '/modules.list.html', 'utf-8'))
                        .to.contain('JSDocTesting');
                    expect(fs.readFileSync(config.opts.destination + '/module-JSDocTesting.html', 'utf-8'))
                        .to.contain('inputDataHere');
                }

                cb(err);
            };
            gulp.src([__dirname + '/testFile*.js']).pipe(jsdoc(config, done));
        });

        it('Should call done and document files with default config', function (cb) {
            gulp.src([__dirname + '/testFile*.js']).pipe(jsdoc(cb));
        });

        it('Should call done and document files with a custom layout', function (cb) {
            config.templates.default.layoutFile = path.resolve('./test/layout.tmpl');

            const done = function (err) {
                if (!err) {
                    const stats = fs.statSync(config.opts.destination);
                    expect(stats.isDirectory()).to.be.true;
                    expect(fs.readFileSync(config.opts.destination + '/modules.list.html', 'utf-8'))
                        .to.contain('24a2357a-1078-11e6-a148-3e1d05defe78');
                    expect(fs.readFileSync(config.opts.destination + '/module-JSDocTesting.html', 'utf-8'))
                        .to.contain('inputDataHere');
                }

                cb(err);
            };
            gulp.src([__dirname + '/testFile.js']).pipe(jsdoc(config, done));
        });

        it('Should document files with a custom layout if no callback provided', function (cb) {
            config.templates.default.layoutFile = path.resolve('./test/layout.tmpl');

            gulp.src([__dirname + '/testFile.js'])
                .pipe(jsdoc(config));

            // Poll
            let count = 0;
            const pollMS = 100;
            const maxPolls = 15;
            const interval = setInterval(() => {
                const stats = fs.readdirSync(config.opts.destination);
                // Files created!
                if (stats.indexOf('modules.list.html') !== -1 && stats.indexOf('module-JSDocTesting.html') !== -1) {
                    expect(fs.readFileSync(config.opts.destination + '/modules.list.html', 'utf-8'))
                        .to.contain('24a2357a-1078-11e6-a148-3e1d05defe78');
                    expect(fs.readFileSync(config.opts.destination + '/module-JSDocTesting.html', 'utf-8'))
                        .to.contain('inputDataHere');
                    clearInterval(interval);
                    return cb();
                }
                if (++count > maxPolls) {
                    clearInterval(interval);
                    return cb(new Error('Timeout'));
                }
            }, pollMS);
        });
    });

    describe('When passed no files', function () {
        it('Should call done with error when no files were passed', function (cb) {
            const done = function (err) {
                expect(err).to.exist;
                cb();
            };
            gulp.src(['./unkownFileName']).pipe(jsdoc(config, done));
        });
    });

    describe('When jsdoc does not exist', function () {
        const cmd = require.resolve('jsdoc/jsdoc.js');
        before(function () {
            fs.renameSync(cmd, cmd + '.renamed');
        });
        after(function () {
            fs.renameSync(cmd + '.renamed', cmd);
        });

        it('Should return an error due to error code != 0', function (cb) {
            const done = function (err) {
                expect(err).to.exist;
                cb();
            };
            gulp.src([__dirname + '/testFile.js']).pipe(jsdoc(config, done));
        });
    });

    describe('When a custom layout file does not exist', function () {
        beforeEach(function () {
            config.templates.default.layoutFile = './nothere.tmpl';
        });

        it('Should return an error due to error code != 0', function (cb) {
            const done = function (err) {
                expect(err).to.exist;
                cb();
            };
            gulp.src([__dirname + '/testFile.js']).pipe(jsdoc(config, done));
        });
    });

    describe('When the child spawn errors', function () {
        let child = require('child_process');
        let originalSpawn = child.spawn;
        beforeEach(function () {
            child.spawn = mySpawn;
            mySpawn.sequence.add(function (cb) {
                // test the error handling
                this.emit('error', new Error('spawn ENOENT'));
                setTimeout(function () {
                    return cb(8);
                }, 10);
            });
        });
        afterEach(function () {
            child.spawn = originalSpawn;
        });

        it('Should call done with error', function (cb) {
            const done = function (err) {
                expect(err).to.exist;
                cb();
            };
            gulp.src([__dirname + '/testFile.js']).pipe(jsdoc(config, done));
        });
    });
});
