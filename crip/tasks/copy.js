var extend = require('extend'),
    Utils = require('./../Utils.js');

function Copy(Crip, gulp) {
    Crip.extend('copy', copy);

    /**
     * @param {String} name Copy task name
     * @param {Array|String} src Globs object
     * @param {String} [output] default: Config.copy.output ('./assets/build')
     * @param {String|Boolean} [base] default: Config.copy.base ('')
     * @param {Boolean} [watch] default: Config.copy.watch (true)
     *
     * @returns {Object}
     */
    function copy(name, src, output, base, watch) {
        var options = extend({src: src}, Crip.Config.get('copy'));

        if (output)
            options.output = output;

        if (typeof base === 'boolean') {
            options.watch = base;
            base = options.base;
        }

        if (typeof watch === 'boolean')
            options.watch = watch;

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('copy', name, action, options.watch ? options.src : false);

        function action() {
            gulp.src(src)
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