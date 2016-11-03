var path = require('path');
var If = require('gulp-if');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var flatmap = require('gulp-flatmap');
var sourcemaps = require('gulp-sourcemaps');

var crip = require('crip-core');

function Scripts(gulp, config, cripweb, registerTask, utils) {
    this.config = config;

    this.fn = function (taskName, globs, outputPath, outputFileName, prependPath) {
        if (!crip.isArray(globs) && !crip.isString(globs))
            throw new Error('Scripts task could not be executed without globs! "globs" argument as Array | String is required.');

        if (!crip.isString(taskName) || taskName.length < 3)
            throw new Error('Scripts task could not be executed without name! "name" argument as String with length > 3 is required.');


        // use name from parameters or task name;
        var fileName = outputFileName && !crip.isBoolean(outputFileName) ? path.basename(outputFileName, '.js') : taskName;

        var options = {
            src: globs,
            base: config.get('scripts.base'),
            output: config.get('scripts.output'),
            uglify: config.get('scripts.uglify'),
            sourcemaps: config.get('scripts.sourcemaps'),
            concat: !(crip.isUndefined(outputFileName) && crip.isUndefined(prependPath) && crip.isUndefined(outputPath)),
            outputFile: { basename: fileName, extname: '.js' }
        };

        if (crip.isBoolean(outputPath)) {
            options.concat = outputPath;
            prependPath = outputFileName;
            options.outputFile.basename = taskName;
        }

        // if only outputPath is presented, use it as outputFileName
        if (crip.isUndefined(outputFileName) && crip.isUndefined(prependPath) && crip.isDefined(outputPath) && !crip.isBoolean(outputPath)) {
            options.outputFile.basename = path.basename(outputPath, '.js');
            outputPath = undefined;
        }

        // owerride default output if outputPath is presented in method
        if (!crip.isBoolean(outputPath) && (outputPath || outputPath == ''))
            options.output = outputPath;

        // owerride default base if prependPath is presented in method
        if (prependPath || prependPath == '')
            options.base = prependPath;

        // use property outputFileName as flag for concat in case if it is boolean
        if (crip.isBoolean(outputFileName))
            options.concat = outputFileName;

        utils.appendBase(options);

        function gulpAction() {
            var enableSourcemapsConcat = !!(options.sourcemaps.enabled && options.concat);
            var enableUglifyNoConcat = !!(options.uglify.enabled && !options.concat);
            var enableUglifyAndConcat = !!(options.uglify.enabled && options.concat);

            var result = gulp.src(options.src)
                .pipe(If(enableSourcemapsConcat, sourcemaps.init()))
                .pipe(If(options.concat, concat('processing-name.js')))
                .pipe(If(options.concat, rename(options.outputFile)))
                .pipe(If(enableSourcemapsConcat, sourcemaps.write(options.sourcemaps.location, options.sourcemaps.options)))
                .pipe(gulp.dest(options.output))
                .pipe(If(enableUglifyNoConcat, flatmap(function (stream, file) {
                    return stream.pipe(uglify(options.uglify.options).on('error', onError))
                        .pipe(rename({ suffix: '.min' }));
                })))
                .pipe(If(enableUglifyNoConcat, gulp.dest(options.output)))
                .pipe(
                    If(enableUglifyAndConcat, 
                    uglify(options.uglify.options).on('error', onError))
                )
                .pipe(If(enableUglifyAndConcat, rename({ suffix: '.min' })))
                .pipe(If(enableUglifyAndConcat, gulp.dest(options.output)));

            return result;
        }

        function onError (err) {
            console.log(err);
        }

        registerTask.apply(cripweb, ['scripts', taskName, gulpAction, options.src]);

        return cripweb.getPublicMethods();
    }
}

/**
 * Initialise crip default configuration for Scripts task.
 */
Scripts.prototype.configure = function () {
    this.config.set('scripts', {
        base: '{assetsSrc}\\js',
        output: '{assetsDist}\\js',
        uglify: {
            enabled: true,
            options: {}
        },
        sourcemaps: {
            enabled: true,
            location: undefined,
            options: {}
        },
        isInDefaults: true
    });
}

/**
 * Determines are this method tasks included in gulp default task.
 * 
 * @returns {Boolean} Include tasks of this method to defaults or not.
 */
Scripts.prototype.isInDefault = function () {
    return this.config.get('scripts.isInDefaults');
}

module.exports = Scripts;