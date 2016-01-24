# webhelp
nodejs package for web application gulp most used tasks

[![NPM](https://nodei.co/npm/cripweb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cripweb/)

## Exports:
 - gulp: module included and extended gulp;
 - sass: allows register scss compilation;
 - sassConfig: configure scss compilation;
 - scripts: concat, minify and copy javascript files; (TODO: add jshint validation, sourcemaps)
 - scriptsConfig: configure js compilation;
 - styles: concat, minify stylesheets;
 - copy: copy files;
 - watch: add src to run task;
 - config: overall extension configuration;
 - tasks: list all registered tasks;
 
## Examples:
#### Compile sass
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb.sass(
    './src/sass/styles.scss',
    './src/sass/**/*.scss',
    'compile-sass',
    'new-name',
    './dist'
);

gulp.task('default', function () {
    cripweb.gulp.start('compile-sass');
    cripweb.watch();
});


// Compiles `./src/sass/styles.scss` file to `./dist/new-name.css` and creates 
// minified version of file `./dist/new-name.min.css`;
//
// When running `gulp default`, it compiles thous files and on change any of 
// `./src/sass/**/*.scss` files, repeat this action;
```

#### Concat js
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb.scripts(
    [
        'app.js',
        '**/*.js'
    ],
    'app',
    'compile-js',
    './src/js',
    './dist'
);

gulp.task('default', function () {
    cripweb.gulp.start('compile-js');
    cripweb.watch();
});

// Compiles `./src/js/**/*.js` file to `./dist/app.js` and creates 
// minified version of file `./dist/app.min.js`;
//
// When running `gulp default`, it compiles thous files and on change any of 
// `./src/js/**/*.js` files, repeat this action;
```

#### See all registered tasks
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');
    
gulp.task('tasks', function () {
    cripweb.tasks();
});

// CripWeb available tasks list: 
//       - crip-default
//       - crip-watch
```

## webhelp-default

Runs all registered tasks throuth webhelp:
```js
gulp.task('my-task', function () {
    // do something cool
});

cripweb.sass(
    './src/sass/styles.scss',
    './src/sass/**/*.scss',
    'compile-sass',
    'new-name',
    './dist'
);

cripweb.watch('./src/*.html', 'my-task', gulp);

gulp.task('default', function () {
    cripweb.gulp.start('crip-default');
    // will start 'compile-sass' and 'my-task' tasks
});
```