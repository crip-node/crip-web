var extend = require('extend'),
    path = require('path'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    foreach = require('gulp-foreach'),
    Utils = require('./../Utils.js');

function Scripts(Crip, gulp) {
    Crip.extend('scripts', scripts);

    /**
     *
     * @param name
     * @param src
     * @param [output]
     * @param [outputFileName]
     * @param [base]
     * @returns {*}
     */
    function scripts(name, src, output, outputFileName, base) {
        var ofnIsBool = typeof outputFileName === 'boolean',
            sourcemaps = require('gulp-sourcemaps'),
            conf = Crip.Config.get('js'),
            options = extend({src: src, concat: true}, conf),
            fileName = (!ofnIsBool && outputFileName) ? path.basename(outputFileName, '.js') : name;

        if (typeof output === 'boolean') {
            options.concat = output;
            if (outputFileName)
                options.output = outputFileName;
        }
        else {
            if (output)
                options.output = output;

            if (ofnIsBool)
                options.concat = outputFileName;
            else {
                if (outputFileName && typeof base === 'undefined') {
                    options.base = outputFileName;
                    fileName = name;
                }
            }
        }

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('scripts', name, action, options.src);

        function action() {
            var outputFile = {basename: fileName, extname: '.js'};

            return gulp.src(options.src)
                .pipe(gulpif(conf.sourcemaps.enabled && options.concat, sourcemaps.init()))
                .pipe(gulpif(options.concat, concat('processing-name.js')))
                .pipe(gulpif(options.concat, rename(outputFile)))
                .pipe(gulp.dest(options.output))
                .pipe(gulpif(conf.uglify && !options.concat, foreach(function (stream, file) {
                    return stream.pipe(uglify(conf.uglify.options))
                        .pipe(rename({suffix: '.min'}));
                })))
                .pipe(gulpif(conf.uglify && !options.concat, gulp.dest(options.output)))
                .pipe(gulpif(conf.uglify && options.concat, uglify(conf.uglify.options)))
                .pipe(gulpif(conf.uglify && options.concat, rename({suffix: '.min'})))
                .pipe(gulpif(conf.sourcemaps.enabled && options.concat, sourcemaps.write(conf.sourcemaps.options)))
                .pipe(gulpif(conf.uglify && options.concat, gulp.dest(options.output)));
        }

        // allow chain methods
        return Crip.core;
    }
}

module.exports = function (Crip, gulp) {
    new Scripts(Crip, gulp);

    return Crip.core;
};