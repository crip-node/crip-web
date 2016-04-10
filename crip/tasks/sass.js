var extend = require('extend'),
    gulpif = require('gulp-if'),
    Utils = require('./../Utils.js');

function Sass(Crip, gulp) {
    Crip.extend('sass', sass);

    function sass(name, output, renameOutput, watchlist, base) {
        var gulpsass = require('gulp-sass'),
            postcss = require('gulp-postcss'),
            sourcemaps = require('gulp-sourcemaps'),
            processors = getProcessors(),
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
            if (conf.minify) {
                var minProcessors = extend([require('cssnano')], processors);
                gulp.src(name)
                    .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.init()))
                    .pipe(gulpsass(conf.sass.options).on('error', gulpsass.logError))
                    .pipe(postcss(minProcessors))
                    .pipe(gulpif(renameOutput, require('gulp-rename')({basename: name, suffix: '.min', extname: '.css'})))
                    .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.write(conf.sourcemaps.options)))
                    .pipe(gulp.dest(options.output))
            }

            gulp.src(name)
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.init()))
                .pipe(gulpsass(conf.sass.options).on('error', gulpsass.logError))
                .pipe(postcss(processors))
                .pipe(gulpif(renameOutput, require('gulp-rename')({basename: name, extname: '.css'})))
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.write(conf.sourcemaps.options)))
                .pipe(gulp.dest(options.output))
        }

        // allow chain methods
        return Crip.core;
    }

    function getProcessors() {
        var processors = [],
            conf = Crip.Config.get('css');

        // https://github.com/postcss/autoprefixer
        if (conf.autoprefix.enabled)
            processors.push(require('autoprefixer')(conf.autoprefix.options));


        // https://github.com/robwierzbowski/node-pixrem
        if (conf.pixrem.enabled)
            processors.push(require('pixrem')(conf.pixrem.options));


        return processors;
    }
}


module.exports = function (Crip, gulp) {
    new Sass(Crip, gulp);

    return Crip.core;
};