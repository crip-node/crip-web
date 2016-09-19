var extend = require('extend'),
    Utils = require('./../Utils.js');
/**
 * 
 * 
 * @param {Crip} Crip
 * @param {any} gulp
 */
function Copy(Crip, gulp) {
    Crip.extend('copy', copy);

    /**
     * @param {String} name Copy task name
     * @param {Array|String} src Globs object
     * @param {String} [output] default: Config.copy.output ('./assets/build')
     * @param {String} [base] default: Config.copy.base ('')
     *
     * @returns {Object}
     */
    function copy(name, src, output, base) {
        var options = extend({src: src}, Crip.Config.get('copy'));

        if (output || output === '')
            options.output = output;

        // watch = undefined, base = watch
        if (base || base === '')
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('copy', name, action, options.src);

        function action() {
            return gulp.src(options.src)
                .pipe(gulp.dest(options.output));
        }

        // allow chain methods
        return Crip.core;
    }
}

module.exports = function (Crip, gulp) {
    new Copy(Crip, gulp);

    return Crip.core;
};