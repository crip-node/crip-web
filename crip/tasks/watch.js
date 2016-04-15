var extend = require('extend'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    Utils = require('./../Utils.js');

function Watch(Crip, gulp) {
    Crip.extend('watch', watcher);

    /**
     * @param {String} name
     * @param {Array|String} src
     * @param {Array|String} deps
     * @param {String} [base]
     *
     * @returns {Object}
     */
    function watcher(name, src, deps, base) {
        var options = extend({src: src}, Crip.Config.get('watch'));

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('watch', name, action, options.src);

        function action() {
            return watch(options.src, batch(function (a, b) {
                return gulp.start(deps, b);
            }));
        }

        // allow chain methods
        return Crip.core;
    }
}

module.exports = function (Crip, gulp) {
    new Watch(Crip, gulp);

    return Crip.core;
};