var extend = require('extend'),
    path = require('path'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    Utils = require('./../Utils.js'),
    CssHelper = require('./../CssHelper.js');

function Styles(Crip, gulp, cssHelper) {
    Crip.extend('styles', styles);

    function styles(name, src, output, outputFileName, base) {
        var postcss = require('gulp-postcss'),
            sourcemaps = require('gulp-sourcemaps'),
            conf = Crip.Config.get('css'),
            options = extend({src: src}, conf),
            fileName = outputFileName ? path.basename(outputFileName, '.css') : name;

        if (output)
            options.output = output;

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('styles', name, action, options.src);

        function action() {
            var outputFile = {basename: fileName, extname: '.css'};

            // compile to .css
            return compile(outputFile, false)
                // min only normal compilation is completed
                .on('end', function () {
                    if (conf.minify) {
                        outputFile.suffix = '.min';

                        // compile to .min.css
                        return compile(outputFile, true);
                    }
                });
        }

        function compile(outputFile, enableCssnano) {
            return gulp.src(options.src)
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.init()))
                .pipe(concat('processing-name.css'))
                .pipe(postcss(cssHelper.processors(enableCssnano)))
                .pipe(require('gulp-rename')(outputFile))
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.write(conf.sourcemaps.options)))
                .pipe(gulp.dest(options.output))
        }

        // allow chain methods
        return Crip.core;
    }
}


module.exports = function (Crip, gulp) {
    new Styles(Crip, gulp, new CssHelper(Crip));

    return Crip.core;
};