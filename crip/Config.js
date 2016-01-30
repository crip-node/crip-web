var p = require('path');

var config = {
    tasks: {},
    assetsPath: './',
    outputPath: './build',
    css: {
        srcPath: 'css',
        destPath: 'css',
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
            srcPath: 'sass',
            // https://github.com/sass/node-sass#options
            options: {
                outputStyle: 'compressed',
                precision: 10
            }
        }
    },

    js: {
        srcPath: 'js',
        destPath: 'js',
        uglify: {
            enabled: true,
            options: {}
        },
        sourcemaps: {
            concat: true,
            min: true,
            options: {}
        }
    }
};

/**
 * Fetch a config item, using a string dot-notation.
 *
 * @param  {string} path
 * @return {string}
 */
config.get = function (path) {
    var basePath;
    var current = config;

    var segments = path.split('.');

    // If the path begins with "assets" or "public," then
    // we can assume that the user wants to prefix the
    // given base url to their config path. Useful!

    if (segments[0] == 'assets' || segments[0] == 'output') {
        basePath = config[segments.shift() + 'Path'];
    }

    segments.forEach(function (segment) {
        current = current[segment];
    });

    return p.join(basePath, current);
};


module.exports = config;