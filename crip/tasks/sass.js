var extend = require('extend'),
    path = require('path'),
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
            var outputFile = {basename: path.basename((renameOutput || name), '.scss'), extname: '.css'};

            // compile to .css
            compile(outputFile, conf.sass.options)
                // min only normal compilation is completed
                .on('end', function () {
                    if (conf.minify) {
                        conf.sass.options.outputStyle = 'compressed';
                        outputFile.suffix = '.min';

                        // compile to .min.css
                        compile(outputFile, conf.sass.options);
                    }
                });
        }

        function compile(outputFile, sassOptions) {
            return gulp.src(path.join(options.base, name))
                .pipe(gulpif(conf.sourcemaps.enabled, sourcemaps.init()))
                .pipe(gulpsass(sassOptions).on('error', gulpsass.logError))
                .pipe(postcss(processors))
                .pipe(require('gulp-rename')(outputFile))
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