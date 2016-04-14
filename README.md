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


#### crip.copy

``crip.copy( name, src [, output [, base [, watch ] ] ] )``

**name**
Type: string

**src**
Type: string or array

**output**
Type: string or boolean

Output location of files to be copied. 
By default is used configuration ``copy.otput`` value (``./assets/build``).
If presented as boolean, it is used as ``watch`` parameter.

**base**
Type: string or boolean

Prefix for all ``src`` items.
By default is used configuration ``copy.base`` value (````).
If presented as boolean, it is used as ``watch`` parameter.

**watch**
Type: boolean

If it is `false`, after task is completed it will be closed. If `true` - watch will be applied for src items and vill be copied after change.

 
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
