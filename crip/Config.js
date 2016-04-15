var path = require('path'),
    Utils = require('./Utils.js'),
    colors = require('colors'),
    fs = require('fs'),
    extend = require('extend');

function Config(Crip, defaults) {
    var self = this;
    this.get = get;
    this.set = set;
    this.assets = './assets/src';
    this.output = './assets/build';

    // enable CRIP logs in console
    this.log = true;

    // copy gulp.src options object. Supports:
    // https://github.com/isaacs/node-glob#options
    // output - copy output location
    this.copy = {
        base: '',
        output: path.join(self.output)
    };

    this.watch = {
        base: ''
    };

    this.css = {
        base: path.join(self.assets, 'css'),
        output: path.join(self.output, 'css'),
        // create .min.css file
        minify: true,
        // writes autoprefixes for css
        autoprefix: {
            enabled: true,
            options: {
                browsers: ['last 8 version', 'ie >= 8'],
                cascade: false
            }
        },
        // writes sourcemaps
        sourcemaps: {
            enabled: true,
            options: {}
        },
        // it does not work...
        pixrem: {
            enabled: false,
            options: {
                rootValue: 16,
                replace: false,
                atrules: false,
                html: true,
                browsers: 'ie >= 8',
                unitPrecision: 3
            }
        },
        // used to minify styles task result
        cssnano: {
            // enabled when styles task min version compiles
            options: {
                discardComments: {
                    removeAll: true
                }
            }
        },
        sass: {
            base: path.join(self.assets, 'sass'),
            output: path.join(self.output, 'css'),
            // https://github.com/sass/node-sass#options
            options: {
                outputStyle: 'nested',
                precision: 10
            }
        }
    };

    this.js = {
        base: path.join(self.assets, 'js'),
        output: path.join(self.output, 'js'),
        uglify: {
            enabled: true,
            options: {}
        },
        sourcemaps: {
            enabled: true,
            options: {}
        }
    };

    if (defaults)
        this.set(defaults);

    /**
     * Fetch a config item, using a string dot-notation.
     *
     * @param  {String} configPath
     * @param {Boolean} [getParent]
     * @return {string}
     */
    function get(configPath, getParent) {
        var current = self,
            segments = configPath.split('.');

        if (getParent)
            segments = segments.slice(0, -1);

        if (segments[0] === '')
            segments = segments.slice(1);

        Utils.forEach(segments, function (segment) {
            current = current[segment];
        });

        return current;
    }

    /**
     *
     * Set a config section object, using a string dot-notation.
     *
     * @param {String|Object} configPath|value
     * @param {Object} [value]
     *
     * @returns {Object}
     */
    function set(configPath, value) {
        if (typeof configPath === 'undefined' && typeof value === 'undefined') {
            console.log('Undefined configuration change parameters'.red);
            return Crip.core;
        }

        var configPathToSet = arguments[0],
            valueToSet = arguments[1];

        if (typeof arguments[1] === 'undefined') {
            valueToSet = arguments[0];
            configPathToSet = '';

            if (typeof valueToSet === 'string')
                valueToSet = readConfig(valueToSet);
        }

        var isPrimitive = typeof valueToSet !== 'object',
            obj = get(configPathToSet, isPrimitive),
            lastKey = configPathToSet.split('.').slice(-1)[0];

        if (isPrimitive && typeof obj[lastKey] === typeof valueToSet)
            obj[lastKey] = valueToSet;
        else
        // if we overwrite with object, we can do it using js references
            extend(true, get(configPathToSet), valueToSet);

        // allow chain after configuration update
        return Crip.core;
    }


    /**
     * Extend config from file
     *
     * @param {String} file Config file location
     */
    function readConfig(file) {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    }
}


module.exports = function (Crip, defaults) {
    return new Config(Crip, defaults);
};