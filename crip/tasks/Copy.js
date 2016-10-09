var utils = require('./../utils');
var crip = require('./../crip');

function Copy(gulp, config, cripweb, registerTask) {

    this.config = config;

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
        if (!crip.isArray(globs) && !crip.isString(globs))
            throw new Error('Copy task could not be executed without globs! "globs" argument as Array | String is required.');

        if (!crip.isString(taskName) || taskName.length < 3)
            throw new Error('Copy task could not be executed without name! "name" argument as String with length > 3 is required.');

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
            var result = gulp.src(options.src)
                .pipe(gulp.dest(options.output));

            return result;
        }

        registerTask.apply(cripweb, ['copy', taskName, gulpAction, options.src/*, TODO: include or exclude task from default */]);

        return cripweb.getPublicMethods();
    }
}

/**
 * Initialise crip default configuration for Copy task.
 */
Copy.prototype.configure = function () {
    this.config.set('copy', {
        base: '',
        output: '{assetsDist}',
        isInDefaults: true
    });
}

/**
 * Determines are this method tasks included in gulp default task.
 * 
 * @returns {Boolean} Include tasks of this method to defaults or not.
 */
Copy.prototype.isInDefault = function () {
    return this.config.get('copy.isInDefaults');
}


module.exports = Copy;