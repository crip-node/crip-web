var extend = require('extend'),
    path = require('path'),
    gulpif = require('gulp-if'),
    Utils = require('./../Utils.js'),
    CssHelper = require('./../CssHelper.js');

function Sass(Crip, gulp, cssHelper) {
    Crip.extend('sass', sass);

    /**
     * @param {String} name
     * @param {String} file
     * @param {String} [output]
     * @param {String} [outputFileName]
     * @param {String} [watchlist]
     * @param {String} [base]
     * @returns {*}
     */
    function sass(name, file, output, outputFileName, watchlist, base) {
        var gulpsass = require('gulp-sass'),
            postcss = require('gulp-postcss'),
            sourcemaps = require('gulp-sourcemaps'),
            conf = Crip.Config.get('css'),
            options = extend({src: (watchlist || file)}, conf.sass);

        if (arguments.length === 1) {
            options.src = name;
            name = path.basename(name, '.scss');
        } else {
            if (output || output === '')
                options.output = output;

            if (base || base === '')
                options.base = base;
        }

        Utils.appendBase(options);
        var compilableFile = path.join(options.base, (file || (name + '.scss')));

        new Crip.Task('sass', name, action, options.src);

        function action() {
            if(!require('fs').existsSync(compilableFile)) {
                console.log(('Task ' + name + ' uses non existing file ' + compilableFile).red);
                return gulp;
            }

            var outputFile = {basename: path.basename((outputFileName || file || name), '.scss'), extname: '.css'};

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
            return gulp.src(compilableFile)
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