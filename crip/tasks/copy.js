var extend = require('extend');
var Utils = require('./../Utils.js');


function Copy(gulp, config, methods, newTaskCb) { }

/**
 * Copy globs to output path
 * 
 * @param {String} taskName - unique task name
 * @param {String|Array} globs - globs to work with
 * @param {?String} outputPath - target path to copy files
 * @param {?String} prependPath - pre string to append for all globs
 * @returns {CripMethods}
 */
Copy.prototype.fn = function (taskName, globs, outputPath, prependPath) {
    var options = extend({ src: globs }, config.get('copy'));

    // owerride default output if outputPath is presented in method
    if (outputPath || outputPath == '')
        options.output = outputPath;

    // owerride default base if prependPath is presented in method
    if (prependPath || prependPath == '')
        options.base = prependPath;

    Utils.appendBase(options);

    function gulpAction() {
        return gulp.src(options.src)
            .pipe(gulp.dest(options.output));
    }

    newTaskCb('copy', name, gulpAction, options.src);

    return methods;
}


module.exports = Copy;