var extend = require('extend'),
    path = require('path'),
    gulpif = require('gulp-if'),
    Utils = require('./../Utils.js'),
    CssHelper = require('./../CssHelper.js');

function Sass(Crip, gulp, cssHelper) {
    Crip.extend('sass', sass);

    function sass(name, output, renameOutput, watchlist, base) {
        var gulpsass = require('gulp-sass'),
            postcss = require('gulp-postcss'),
            sourcemaps = require('gulp-sourcemaps'),
            src = watchlist || name,
            conf = Crip.Config.get('css'),
            options = extend({src: src}, conf.sass);

        if (output)
            options.output = output;

        if (base)
            options.base = base;

        Utils.appendBase(options);

        new Crip.Task('sass', name, action, options.src);

        function action() {
            var outputFile = {basename: path.basename((renameOutput || name), '.scss'), extname: '.css'};

            // compile to .css
            return compile(outputFile, conf.sass.options)
                // min only normal compilation is completed
                .on('end', function () {
                    if (conf.minify) {
                        conf.sass.options.outputStyle = 'compressed';
                        outputFile.suffix = '.min';

                        // compile to .min.css
                        return compile(outputFile, conf.sass.options);
                    }
                });
        }

        function compile(outputFile, sassOptions) {
            return gulp.src(path.join(options.base, name))
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.init()))
                .pipe(gulpsass(sassOptions).on('error', gulpsass.logError))
                .pipe(postcss(cssHelper.processors()))
                .pipe(require('gulp-rename')(outputFile))
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.write(conf.sourcemaps.options)))
                .pipe(gulp.dest(options.output))
        }

        // allow chain methods
        return Crip.core;
    }
}


module.exports = function (Crip, gulp) {
    new Sass(Crip, gulp, new CssHelper(Crip));

    return Crip.core;
};