# CripWeb 3
Crip fluent API for Gulp

[![NPM](https://nodei.co/npm/cripweb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cripweb/)

## Instalation

```cmd
npm install cripweb --save
```


## Configurations

To overwrite configuration defaults, you can simply pass an configuration object directly for constructor, or physical path of configuration json file.

Physical path of configuration json file:
```js
var gulp = require('gulp');
var cripweb = require('cripweb');

cripweb(gulp, './settings.json')(function (crip) {
    // do your cool stuff here
});
```

Configuration object directly:
```js
var gulp = require('gulp');
var cripweb = require('cripweb');

cripweb(gulp, { settings: 'value' })(function (crip) {
    // do your cool stuff here
});
```

Inline configuration:
```js
var gulp = require('gulp');
var cripweb = require('cripweb');

cripweb(gulp)(function (crip) {
    crip.config.set('./settings.json'); // path of configuration json file
    crip.config.set('js.uglify.enabled', true); // dot notation path for option
    crip.config.set({log: true, js: {sourcemaps: {enabled: false}}}); // directly object properties
});
```

## Crip exports tasks:
 - [copy](https://github.com/crip-node/crip-web/wiki/Task-crip.copy): copy files;
 - [watch](https://github.com/crip-node/crip-web/wiki/Task-crip.watch): watch file changes and run tasks on change;
 - [scripts](https://github.com/crip-node/crip-web/wiki/Task-crip.scripts): concat, uglify and copy javascript files;
 - [webpack](https://github.com/crip-node/crip-web-webpack): execute webpack (external);


Scripts and SASS tasks are depricated and will be implemented at later state as external plugins.


### crip.copy( taskName, globs [, outputPath [, prependPath ] ] )

##### taskName
Type: `string`

Task name for gulp output. Will be prefixed with `copy-` to be unique in gulp.

##### globs
Type: `string` or `array`

Glob or array of globs to read and listenned on watch-globs task.

##### outputPath
Type: `string`

The path (output folder) to write files to.
By default is used configuration `copy.otput` value (`{assetsDist}`).

##### prependPath
Type: `string`

The place where patterns starting with / will be mounted onto `globs` items.
By default is used configuration `copy.base` value (`empty string`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.copy('build', ['vendor.js', 'core.js', 'app.js'], 'application/scripts', 'assets/build/js');
    // Will make available gulp tasks 'copy' and 'copy-build'
    // Will copy 'assets/build/js/vendor.js', 'assets/build/js/core.js' and 
    //  'assets/build/js/app.js' to './application/scripts/' folder

    crip.config.set('copy', {base: 'assets/src', output: 'assets/copy'});
    crip.copy('src-clone', 'css/**/*', crip.config.get('copy.output') + '/css'); 
    // Will make available gulp task 'copy-src-clone'
    // After this configuration change this task will copy all files and folders 
    //  from './assets/src/css/' to './assets/copy/css' folder
});
```
 
### crip.watch( taskName, globs , deps [, prependPath ] )

##### taskName
Type: `string`

Task name for gulp output. Will be prefixed with `watch-`.

##### globs
Type: `string` or `array`

Glob or array of globs to read and listenned on watch-globs task.

##### deps
Type: `string` or `array`

String or array of tasks to be executed and completed on globs change.

##### prependPath
Type: `string`

The place where patterns starting with / will be mounted onto `globs` items.
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

    crip.config.set('copy', {base: 'assets/src', output: 'assets/copy', watch: false});
    crip.copy('src-clone', 'css/**/*', crip.config.get('copy.output') + '/css');
});
```

### crip.scripts( taskName, globs [ [, outputPath ] , outputFileName [, prependPath ] ] )

By Default uglify and sourcemaps are enabled. (For minified file versions sourcemaps are disabled and they may be used in production)

##### taskName
Type: `string`

Task name for gulp output. Will be prefixed with `scripts-`.

##### globs
Type: `string` or `array`

Glob or array of globs to read.

##### outputPath
Type: `string`

The path (output folder) to write files to.
By default is used configuration `js.output` value (`{assetsDist}\\js`).

##### outputFileName
Type: `string` or `boolean`

The name of concatenated file. By default/on 'true' value will be used `taskName` property without task prefix.
If file name is not presented or value is `false` - files will not be concanateted and will be copied and uglified.

##### prependPath
Type: `string`

The place where patterns starting with / will be mounted onto `globs` items.
By default is used configuration `js.base` value (`{assetsSrc}\\js`).

```js
var gulp = require('gulp'),
    cripweb = require('cripweb');

cripweb(gulp)(function (crip) {

    crip.scripts('build', ['components/*.js', 'index.js'], 'assets/build/js', 'app-scripts', 'assets/src/js');
    // Will make available gulp tasks 'scripts' and 'scripts-build'
    // Will concatenate and copy files 'assets/src/js/index.js' and 'assets/src/js/components/*.js' to 
    //  'assets/build/js/app-scripts.js' and 'assets/build/js/app-scripts.min.js' files

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