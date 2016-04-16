# CripWeb 2
Crip fluent API for Gulp

[![NPM](https://nodei.co/npm/cripweb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cripweb/)

## Configurations

To overwrite configuration defaults, you can simply pass an configuration object directly for constructor, or physical path of configuration json file.

Physical path of configuration json file:
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp, './settings.json')(function (crip) {
    // do your cool stuff here
});
```

Configuration object directly:
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp, {log: false})(function (crip) {
    // do your cool stuff here
});
```

Inline configuration:
```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {
    crip.config.set('./settings.json') // path of configuration json file
        .config.set('js.uglify.enabled', true) // dot notation path for option
        .config.set({log: true, js: {sourcemaps: {enabled: false}}}); // directly object properties
});
```

Default CripWeb configuration:

```json
{
  "assets": "./assets/src",
  "output": "./assets/build",
  "log": false,
  "copy": {
    "base": "",
    "watch": false,
    "output": "./assets/build"
  },
  "watch": {
    "base": ""
  },
  "css": {
    "base": "./assets/src/css",
    "output": "./assets/build/css",
    "minify": true,
    "autoprefix": {
      "enabled": true,
      "options": {
        "browsers": [
          "last 8 version",
          "ie >= 8"
        ],
        "cascade": false
      }
    },
    "sourcemaps": {
      "enabled": true,
      "options": {}
    },
    "pixrem": {
      "enabled": false,
      "options": {
        "rootValue": 16,
        "replace": false,
        "atrules": false,
        "html": true,
        "browsers": "ie >= 8",
        "unitPrecision": 3
      }
    },
    "cssnano": {
      "options": {
        "discardComments": {
          "removeAll": true
        }
      }
    },
    "sass": {
      "base": "./assets/src/sass",
      "output": "./assets/build/css",
      "options": {
        "outputStyle": "nested",
        "precision": 10
      }
    }
  },
  "js": {
    "base": "./assets/src/js",
    "output": "./assets/src/js",
    "uglify": {
      "enabled": true,
      "options": {}
    },
    "sourcemaps": {
      "enabled": true,
      "options": {}
    }
  }
}
```

## Crip exports tasks:
 - copy: copy files;
 - watch: watch file changes and run tasks on change;
 - scripts: concat, uglify and copy javascript files; (TODO: add jshint validation) 
 - styles: concat and minify stylesheets; (TODO: fix pixrem)
 - sass: compile sass in to css and minify;


### crip.copy( name, src [, output , base ] )

##### name
Type: `string`

Task name for gulp output. Will be prefixed with `copy-`.

##### src
Type: `string` or `array`

Glob or array of globs to read.

##### output
Type: `string`

The path (output folder) to write files to.
By default is used configuration ``copy.otput`` value (``./assets/build``).

##### base
Type: `string`

The place where patterns starting with / will be mounted onto `src` items.
By default is used configuration `copy.base` value (`empty string`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.copy('build', ['vendor.js', 'core.js', 'app.js'], 'application/scripts', 'assets/build/js');
    // Will make available gulp tasks 'copy' and 'copy-build'
    // Will copy 'assets/build/js/vendor.js', 'assets/build/js/core.js' and 
    //  'assets/build/js/app.js' to './application/scripts/' folder

    crip.config.set('copy', {base: 'assets/src', output: 'assets/copy'})
        .copy('src-clone', 'css/**/*', crip.config.get('copy.output') + '/css'); 
    // Will make available gulp task 'copy-src-clone'
    // After this configuration change this task will copy all files and folders 
    //  from './assets/src/css/' to './assets/copy/css' folder
});
```
 
### crip.watch( name, src , deps [, base ] )

##### name
Type: `string`

Task name for gulp output. Will be prefixed with `watch-`.

##### src
Type: `string` or `array`

Glob or array of globs to read.

##### deps
Type: `string` or `array`

String or array of tasks to be executed and completed on src globs change.

##### base
Type: `string`

The place where patterns starting with / will be mounted onto `src` items.
By default is used configuration `watch.base` value (`empty string`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

gulp.task('task-name', function(){
    // do your default gulp stuff
});

cripweb(gulp)(function (crip) {

    crip.watch('styles', 'css/**/*', ['copy-src-clone', 'task-name'], 'assets/src');
    // Will make available gulp task 'watch-styles'
    // Will start gulp tasks 'copy-src-clone' and 'task-name' when src globs changes

    crip.config.set('copy', {base: 'assets/src', output: 'assets/copy', watch: false})
         .copy('src-clone', 'css/**/*', crip.config.get('copy.output') + '/css');
});
```

### crip.scripts( name, src [, output , outputFileName , base ] )

##### name
Type: `string`

Task name for gulp output. Will be prefixed with `scripts-`.

##### src
Type: `string` or `array`

Glob or array of globs to read.

##### output
Type: `string`

The path (output folder) to write files to.
By default is used configuration `js.output` value (`./assets/build/js`).

##### outputFileName
Type: `string`

The name of concatenated file. By default will be used `name` property without task prefix.

##### base
Type: `string`

The place where patterns starting with / will be mounted onto `src` items.
By default is used configuration `js.base` value (`./assets/src/js`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.scripts('build', ['components/*.js', 'index.js'], 'assets/build/js', 'app-scripts', 'assets/src/js');
    // Will make available gulp tasks 'scripts' and 'scripts-build'
    // Will concatenate and copy files 'assets/src/js/index.js' and 'assets/src/js/components/*.js' to 
    //  'assets/build/js/app-scripts.js' and 'assets/build/js/app-scripts.min.js' files

    // If outputFileName is not presented, task name will be used for new file names:

    crip.scripts('build-2', ['components/*.js', 'index.js'], 'assets/build/js', 'assets/src/js');
    // Will make available gulp task 'scripts-build-2'
    // Will concatenate and copy files 'assets/src/js/index.js' and 'assets/src/js/components/*.js' to 
    //  'assets/build/js/build-2.js' and 'assets/build/js/build-2.min.js' files

    // If outputFileName is presented as boolean, it is used af flag for concatenation:

    crip.scripts('build-3', ['root.js', 'index.js'], 'assets/build/js', false, 'assets/src/js');
    // Will make available gulp task 'scripts-build-3'
    // Will make copy of 'assets/src/js/root.js' and 'assets/src/js/index.js' files and its 
    //  minimized version in output folder:
    //    - 'assets/build/js/root.js' and 'assets/build/js/root.min.js'
    //    - 'assets/build/js/index.js' and 'assets/build/js/index.min.js'

    // If you already configured your scripts output and you no need to concatenate, 
    //  use output as concatenate flag:

    crip.config.set('js', {output: 'assets/build/js', uglify: {enabled: false}})
        .scripts('build-4', ['root.js', 'index.js'], false, 'assets/src/js');
        // Will make available gulp task 'scripts-build-4'
        // Will make copy of 'assets/src/js/root.js' and 'assets/src/js/index.js' in configured output folder:
        //  - 'assets/build/js/root.js'
        //  - 'assets/build/js/index.js'
        // If concatenate is disabled, crip automatically disables sourcemaps.
});
```
 
### crip.styles( name, src , [ output , outputFileName , base ] )

##### name
Type: `string`

Task name for gulp output. Will be prefixed with `styles-`.

##### src
Type: `string` or `array`

Glob or array of globs to read.

##### output
Type: `string`

The path (output folder) to write files to.
By default is used configuration `css.output` value (`./assets/build/css`).

##### outputFileName
Type: `string`

The name of the new file. By default will be used `name` property without task prefix.

##### base
Type: `string`

The place where patterns starting with / will be mounted onto `src` items.
By default is used configuration `css.base` value (`./assets/src/css`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.styles('app', ['index.css', '**/*.css'], 'assets/build', 'app-styles', 'assets/src/css');
    // Will make available gulp tasks 'styles' and 'styles-app'
    // Will concatenate and copy files 'assets/src/css/index.css' and 'assets/src/css/**/*.css' to 
    //  'assets/build/app-styles.css' and 'ssets/build/app-styles.min.css' files

    // If outputFileName is not presented, task name will be used for new file names:

    crip.styles('app-2', ['index.css', '**/*.css'], 'assets/build', 'assets/src/css');
    // Will make available gulp task 'styles-app-2'
    // Will concatenate and copy files 'assets/src/css/index.css' and 'assets/src/css/**/*.css' to 
    //  'assets/build/app-2.css' and 'ssets/build/app-2.min.css' files

});
```
 
### crip.sass( name, file , [ output , outputFileName , watchlist , base ] )

##### name
Type: `string`

Task name for gulp output. Will be prefixed with `sass-`.

##### file
Type: `string`

Sass file, to be compiled.

##### output
Type: `string`

The path (output folder) to write files to.
By default is used configuration `css.sass.output` value (`./assets/build/css`).

##### outputFileName
Type: `string`

The name of the new file. By default will be used compiled file basename.

##### watchlist
Type: `string` or `array`

Glob or array of globs to watch changes.

##### base
Type: `string`

The place where patterns starting with / will be mounted onto `src` items.
By default is used configuration `css.sass.base` value (`./assets/src/sass`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.sass('app-1', 'assets/src/sass/app.scss', 'assets/compiled-sass', 'file-name', '**/*.scss', 'assets/src/sass');
    // Will make available gulp tasks 'sass' and 'sass-app-1'
    // Will compile 'assets/src/sass/app.scss' file to 'assets/compiled-sass/file-name.css'
    // When watch task runs, it will watch 'assets/src/sass/**/*.scss' files and rerun this task on change event

    crip.config.set('css.sass', {output: 'assets/compiled-sass'})
        .sass('assets/src/sass/app.scss');
    // Will make available gulp task 'sass-app'
    // Will compile 'assets/src/sass/app.scss' file to 'assets/compiled-sass/app.css'
    // When watch task runs, it will watch 'assets/src/sass/app.scss' file and rerun this task on change event

});
```