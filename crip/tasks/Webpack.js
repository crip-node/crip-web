var utils = require('./../utils');
var crip = require('./../crip');
var webpack = require('webpack');

function Webpack(gulp, config, cripweb, registerTask) {

    this.config = config;

    /**
     * Webpack wrapper
     * 
     * @param {String} taskName - unique task name
     * @param {String|Array} globs - globs to work with
     * @param {?Object} webpackConfig - webpack configuration file
     * @param {?String} outputPath - target path to webpack files
     * @param {?String} prependPath - pre string to append for all globs
     * @returns {CripMethods}
     */
    this.fn = function (taskName, globs, webpackConfig, outputPath, prependPath) {
        if (!crip.isArray(globs) && !crip.isString(globs))
            throw new Error('Webpack task could not be executed without globs! "globs" argument as Array | String is required.');

        if (!crip.isString(taskName) || taskName.length < 3)
            throw new Error('Webpack task could not be executed without name! "name" argument as String with length > 3 is required.');

        var options = {
            src: globs,
            base: config.get('webpack.base'),
            output: config.get('webpack.output'),
            config: config.get('webpack.config')
        };

        if (crip.isString(webpackConfig)) {
            prependPath = outputPath;
            outputPath = webpackConfig;
        }

        if (crip.isObject(webpackConfig)) {
            options.config = webpackConfig;
        }

        // owerride default output if outputPath is presented in method
        if (outputPath || outputPath == '')
            options.output = outputPath;

        // owerride default base if prependPath is presented in method
        if (prependPath || prependPath == '')
            options.base = prependPath;

        utils.appendBase(options);

        function gulpAction() {
            var result = gulp.src(options.src)
                .pipe(webpack(options.config), function(err, stats) {
                    crip.log(crip.supplant('[webpack:{name}]', { name: taskName }), stats.toString());
                })
                .pipe(gulp.dest(options.output));

            return result;
        }

        registerTask.apply(cripweb, ['webpack', taskName, gulpAction, options.src/*, TODO: include or exclude task from default */]);

        return cripweb.getPublicMethods();
    }
}

/**
 * Initialise crip default configuration for Webpack task.
 */
Webpack.prototype.configure = function () {
    this.config.set('webpack', {
        base: '',
        output: '{assetsDist}',
        config: {},
        isInDefaults: true
    });
}

/**
 * Determines are this method tasks included in gulp default task.
 * 
 * @returns {Boolean} Include tasks of this method to defaults or not.
 */
Webpack.prototype.isInDefault = function () {
    return this.config.get('webpack.isInDefaults');
}


module.exports = Webpack;