var extend = require('extend'),
    Utils = require('./../Utils.js');

function Watch(Crip, gulp) {
    Crip.extend('watch', watch);

    /**
     * @param {String} name
     * @param {Array|String} src
     * @param {Array|String} tasks
     * @param {String} [base]
     *
     * @returns {Object}
     */
    function watch(name, src, tasks, base) {
        var options = extend({src: src}, Crip.Config.get('watch'));

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('watch', name, action, options.src);

        function action() {
            return gulp.start(tasks);
        }

        // allow chain methods
        return Crip.core;
    }
}

module.exports = function (Crip, gulp) {
    new Watch(Crip, gulp);

    return Crip.core;
};