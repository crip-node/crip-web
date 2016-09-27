var utils = require('./../utils');

function Copy(gulp, config, cripweb, registerTask) {

    /**
     * Copy globs to output path
     * 
     * @param {String} taskName - unique task name
     * @param {String|Array} globs - globs to work with
     * @param {?String} outputPath - target path to copy files
     * @param {?String} prependPath - pre string to append for all globs
     * @returns {CripMethods}
     */
    this.fn = function (taskName, globs, outputPath, prependPath) {
        var options = {
            src: globs,
            base: config.get('copy.base'),
            output: config.get('copy.output')
        };

        // owerride default output if outputPath is presented in method
        if (outputPath || outputPath == '')
            options.output = outputPath;

        // owerride default base if prependPath is presented in method
        if (prependPath || prependPath == '')
            options.base = prependPath;

        utils.appendBase(options);

        function gulpAction() {
            return gulp.src(options.src)
                .pipe(gulp.dest(options.output));
        }

        registerTask.apply(cripweb, ['copy', taskName, gulpAction, options.src/*, TODO: include or exclude task from default */]);

        return cripweb.getPublicMethods();
    }
}

/**
 * Initialise crip default configuration for Copy task.
 * 
 * @param {Config} config
 */
Copy.prototype.configure = function (config) {
    config.set('copy', {
        base: '',
        output: '{assetsDist}',
        isInDefaults: true
    });
}

/**
 * Determines are this method tasks included in gulp default task.
 * 
 * @param {Config} config crip configuration for use to determine.
 * @returns {Boolean} Include tasks of this method to defaults or not.
 */
Copy.prototype.isInDefault = function (config) {
    return config.get('copy.isInDefaults');
}


module.exports = Copy;