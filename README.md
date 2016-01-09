# gulp-jsdoc3

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> [jsdoc](https://github.com/jsdoc3/jsdoc) plugin for [gulp](https://github.com/gulpjs/gulp)


Install `gulp-jsdoc` as a development dependency:

```shell
npm install --save-dev gulp-jsdoc3
```

Then, use it where config is the only way to pass in jsdoc options. All CLI options are can be specified here,
the only exception is ink-docstrap is bundled here and used for templating.

```javascript
var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function () {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(config));
});
```

Another good example is in this project's [gulpfile](https://github.com/mlucool/gulp-jsdoc3/blob/master/gulpfile.js)!

## Debugging
Set env variable: ```DEBUG=gulp-jsdoc3```  

## Notes
This is a reasonable attempt to wrap jsdoc using gulp as thinly as possible. All files are added after the cli.
i.e. jsdoc -c config -t node_modules/ink-docstrap/template gulpFile1 gulpFile2  
[jsdoc](https://github.com/jsdoc3/jsdoc) does not allow for piped input, so this attempt may be considered a gulp
anti-pattern. It also does not pass on output to be piped elsewhere.


I would like to thank Mangled Deutz @ [gulp-jsdoc](https://github.com/jsBoot/gulp-jsdoc) for the original implimentation.

License
-------------
[Apache-2.0 License](http://www.apache.org/licenses/LICENSE-2.0)

[npm-url]: https://npmjs.org/package/gulp-jsdoc3
[npm-image]: https://badge.fury.io/js/gulp-jsdoc3.png

[travis-url]: http://travis-ci.org/mlucool/gulp-jsdoc3
[travis-image]: https://secure.travis-ci.org/mlucool/gulp-jsdoc3.png?branch=master

[coveralls-url]: https://coveralls.io/github/mlucool/gulp-jsdoc3?branch=master
[coveralls-image]: https://coveralls.io/repos/mlucool/gulp-jsdoc3/badge.svg?branch=master&service=github

[depstat-url]: https://david-dm.org/mlucool/gulp-jsdoc3
[depstat-image]: https://david-dm.org/mlucool/gulp-jsdoc3.png

