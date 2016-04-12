var path = require('path'),
    Utils = require('./Utils.js');

function Config(defaults) {
    var self = this;
    this.get = get;
    this.assets = './assets/src';
    this.output = './assets/build';

    // enable CRIP logs in console
    this.log = true;

    // copy gulp.src options object. Supports:
    // https://github.com/isaacs/node-glob#options
    // watch - is watch enabled for coping
    // output - copy output location
    this.copy = {
        base: '',
        watch: true,
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

    // TODO: apply defaults for object

    /**
     * Fetch a config item, using a string dot-notation.
     *
     * @param  {string} configPath
     * @return {string}
     */
    function get(configPath) {
        var current = self,
            segments = configPath.split('.');

        Utils.forEach(segments, function (segment) {
            current = current[segment];
        });

        return current;
    }
}


module.exports = function (defaults) {
    return new Config(defaults);
};