var path = require('path'),
    Utils = require('./Utils.js');

function Config(defaults) {
    var self = this;
    this.get = get;
    this.assets = './assets/src';
    this.output = './assets/build';

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
        src: path.join(self.assets, 'css'),
        output: path.join(self.output, 'css'),
        minify: true,
        autoprefix: {
            enabled: true,
            options: {
                browsers: ['last 8 version', 'ie >= 8'],
                cascade: false
            }
        },
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
        src: 'js',
        output: 'js',
        uglify: {
            enabled: true,
            options: {}
        },
        sourcemaps: {
            concat: true,
            min: true,
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