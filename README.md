# cripweb 2
Crip fluent API for Gulp

[![NPM](https://nodei.co/npm/cripweb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cripweb/)

## Crip exports tasks:
 - copy: copy files;
 - watch: watch file changes and run tasks on change;
 - scripts: concat, uglify and copy javascript files; (TODO: add jshint validation) 
 - styles: concat and minify stylesheets; (TODO: fix pixrem)
 - sass: compile sass in to css and minify;

 
## Examples:
#### Compile sass
```js
var gulp = require('gulp'),
    cripweb = require('cripweb')(gulp);

cripweb(function (crip) {
    crip.sass('app.scss');
});
```

#### Concat js
```js
var gulp = require('gulp'),
    cripweb = require('cripweb')(gulp);

cripweb(function (crip) {
    crip.scripts('task-name', ['js/*.js', 'vendor/**/*.js'], 'assets/build/js', 'file-name', 'base-dir');
});
```
