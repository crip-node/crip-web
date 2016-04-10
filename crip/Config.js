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
        output: self.output + ''
    };

    this.css = {
        src: 'css',
        output: 'css',
        autoprefix: {
            enabled: true,
            options: {
                browsers: ['last 2 versions'],
                cascade: false
            }
        },
        sourcemaps: {
            sass: true,
            concat: true,
            min: true,
            options: {}
        },
        sass: {
            src: 'sass',
            // https://github.com/sass/node-sass#options
            options: {
                outputStyle: 'compressed',
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

        Utils.forEach(segments, function(segment){
            current = current[segment];
        });

        return current;
    }
}


module.exports = function (defaults) {
    return new Config(defaults);
};