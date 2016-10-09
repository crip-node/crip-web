var crip = require('crip-core');
var watch = require('gulp-watch');

function Watch(gulp, config, cripweb, registerTask, utils) {

    this.config = config;

    /**
     * Watch globs to to run deps
     * 
     * @param {String} taskName - unique task name
     * @param {String|Array} globs - globs to work with
     * @param {?String} deps - deps to run on globs change
     * @param {?String} prependPath - pre string to append for all globs
     * @returns {CripMethods}
     */
    this.fn = function (taskName, globs, deps, prependPath) {
        if (!crip.isString(taskName) || taskName.length < 3)
            throw new Error('Watch task could not be executed without name! "name" argument as String with length > 3 is required.');

        if (!crip.isArray(globs) && !crip.isString(globs))
            throw new Error('Watch task could not be executed without globs! "globs" argument as Array | String is required.');

        if (!crip.isArray(deps) && !crip.isString(deps))
            throw new Error('Watch task could not be executed without deps! "deps" argument as Array | String is required.');

        var options = {
            src: globs,
            base: config.get('watch.base')
        }

        if (prependPath || prependPath === '')
            options.base = prependPath;

        utils.appendBase(options);

        function gulpAction() {
            gulp.start(deps);

            var result = watch(options.src, function () {
                gulp.start(deps);
            });

            return result;
        }

        registerTask.apply(cripweb, ['watch', taskName, gulpAction, options.src]);

        return cripweb.getPublicMethods();
    }
}

/**
 * Initialise crip default configuration for Watch task.
 */
Watch.prototype.configure = function () {
    this.config.set('watch', {
        base: '',
        isInDefaults: false
    });
}

/**
 * Determines are this method tasks included in gulp default task.
 * 
 * @returns {Boolean} Include tasks of this method to defaults or not.
 */
Watch.prototype.isInDefault = function () {
    return this.config.get('watch.isInDefaults');
}


module.exports = Watch;