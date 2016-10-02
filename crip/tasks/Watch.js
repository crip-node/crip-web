var utils = require('./../utils');
var crip = require('./../crip');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

function Watch(gulp, config, cripweb, registerTask) {

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
        var options = {
            src: globs,
            base: config.get('watch.base')
        }

        if (prependPath || prependPath === '')
            options.base = prependPath;

        utils.appendBase(options);

        function gulpAction() {
            var result = watch(options.src, batch(function (a, b) {
                return gulp.start(deps, b);
            }));

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