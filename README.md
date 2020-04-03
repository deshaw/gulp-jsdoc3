# gulp-jsdoc3

[![NPM version][npm-image]][npm-url] [![NPM DM][npm-dm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url]

> [jsdoc](https://github.com/jsdoc3/jsdoc) plugin for [gulp](https://github.com/gulpjs/gulp)

## Installation

Install `gulp-jsdoc` as a development dependency:

```shell
npm install --save-dev gulp-jsdoc3
```

## Usage

```javascript
const jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});
```

By default, documentation is output to `docs/gen`. gulp-jsdoc3 does not modify the source vinyl stream so the output location can only be specified via config, not `gulp.dest()`. You can see all the default options passed to jsdoc in [`src/jsdocConfig.json`](https://github.com/AndrewGuenther/gulp-jsdoc3/blob/master/src/jsdocConfig.json).

You can also pass in your own config to override the defaults. All CLI options can be specified here.

```javascript
const jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
    const config = require('./jsdoc.json');
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});
```

Another good example is in this project's [gulpfile](https://github.com/deshaw/gulp-jsdoc3/blob/master/gulpfile.js)!

## Overriding the default layout

[ink-docstrap](https://github.com/docstrap/docstrap) is used as the default layout but you can easily override it in your config like this:

```
{
    "templates": {
        "default": {
            // Set my own layout file
            "layoutFile": "./layout.tmpl"
        }
    }
}
```

## Other config tips and tricks
Use [include and exclude](http://usejsdoc.org/about-configuring-jsdoc.html) patterns to filter the globs from gulp even more.
For example, only include .js,.jsdoc, or .jsx files that do not start with _:
```
"source": {
    "includePattern": ".+\\.js(doc|x)?$",
    "excludePattern": "(^|\\/|\\\\)_"
}
```

If you want to document multiple markdown or html files, enable [tutorial support](http://usejsdoc.org/about-tutorials.html):
```
"tutorials": "path/to/tutorials"
```

## Debugging
Set env variable: ```DEBUG=gulp-jsdoc3```

## Notes
This is a reasonable attempt to wrap jsdoc using gulp as thinly as possible use the jsdoc config to pass in files from gulp.
[jsdoc](https://github.com/jsdoc3/jsdoc) does not allow for piped input, so this attempt may be considered a gulp
anti-pattern. It also does not pass on output to be piped elsewhere.


We would like to thank Mangled Deutz @ [gulp-jsdoc](https://github.com/jsBoot/gulp-jsdoc) for the original implementation.

## History

This plugin was contributed back to the community by the [D. E. Shaw group](https://www.deshaw.com/).

![Screenshot](https://github.com/deshaw/gulp-jsdoc3/blob/master/docs/DESCO_logo_200x200.png 'D. E. Shaw Logo')

License
-------------
[Apache-2.0 License](http://www.apache.org/licenses/LICENSE-2.0)

[npm-url]: https://npmjs.org/package/gulp-jsdoc3
[npm-image]: https://badge.fury.io/js/gulp-jsdoc3.png
[npm-dm-image]: https://img.shields.io/npm/dm/gulp-jsdoc3.svg

[travis-url]: http://travis-ci.org/deshaw/gulp-jsdoc3
[travis-image]: https://secure.travis-ci.org/deshaw/gulp-jsdoc3.png?branch=master

[coveralls-url]: https://coveralls.io/github/deshaw/gulp-jsdoc3?branch=master
[coveralls-image]: https://coveralls.io/repos/deshaw/gulp-jsdoc3/badge.svg?branch=master&service=github
