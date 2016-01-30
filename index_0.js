var gulp = require('gulp'),
    colors = require('colors'),
    extend = require('extend'),
    sass = require('gulp-sass'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    foreach = require('gulp-foreach'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    cssgrace = require('cssgrace'),
    cssnano = require('cssnano'),
    autoprefixer = require('autoprefixer');

var config =
    {
        styles: {
            modules: [],
            minify: true,
            sourcemaps: {
                sass: true,
                concat: true,
                min: true,
                settings: {}
            },
            cssgrace: false,
            autoprefix: true,
            pixrem: true,
            dest: './public/build/css',
            compiler_settings: {}
        },
        scripts: {
            modules: [],
            minify: true,
            sourcemaps: {
                concat: true,
                min: true,
                settings: {}
            },
            dest: './public/build/js',
            dir: '',
            uglify_settings: {}
        },
        extra: {
            modules: [],
            counter: 1
        }
    },
    _config =
    {
        listening: true,
        tasks: ['crip-watch', 'crip-default']
    };

module.exports = {
    gulp: gulp,

    sass: sassFn,
    sassConfig: sassConfig,

    scripts: scriptsFn,
    scriptsConfig: scriptsConfig,

    styles: stylesFn,
    copy: copyFn,
    addWatch: addWatch,

    watch: watchFn,
    config: config,
    tasks: tasksFn
};

gulp.task('crip-watch', function () {
    'use strict';
    tasksFn();
    _taskStarted('crip-watch', true);
    _loop(config, function (section) {
        _loop(section.modules, function (params) {
            watch(params.src, function () {
                //_log('2', params.task);
                _taskStarted(params.task, true);
                gulp.start(params.task);
            });
        });
    });
});

gulp.task('crip-default', function () {
    'use strict';
    _config.listening = false;
    _loop(tasksFn(), function (task) {
        //_log('1', taskName);
        if (task !== 'crip-default' && task !== 'crip-watch') {
            if (typeof task == 'object') {
                _taskStarted(task[0], true);
                task[1].start(task[0]);
                return;
            }

            _taskStarted(task, true);
            gulp.start(task);
        }
    });
    _config.listening = true;
});

/* Styles section*/

function sassFn(filename, watchlist, task, rename, destination) {
    'use strict';
    var resultWatch = watchlist || filename,
        new_sass_config = {
            file: filename || _error('Sass should contain filename'),
            src: resultWatch,
            task: task || filename,
            rename: !!rename,
            name: rename || 'default',
            dest: destination || config.styles.dest
        };

    return newSassTask(new_sass_config);
}

function newSassTask(params) {
    'use strict';
    config.styles.modules.push(params);
    _config.tasks.push(params.task);

    var st = config.styles,
        sm = st.sourcemaps,
        processors = _cssProcessors();

    gulp.task(params.task, function () {
        if (st.minify) {
            // clone processors to not break compilation without minification
            var minProcessors = extend([], processors);
            minProcessors.push(cssnano);
            gulp.src(params.file)
                .pipe(gulpif(sm.min, sourcemaps.init()))
                .pipe(sass(st.compiler_settings).on('error', sass.logError))
                .pipe(postcss(minProcessors))
                .pipe(gulpif(params.rename, rename({basename: params.name, extname: '.css'})))
                .pipe(rename({suffix: '.min'}))
                .pipe(gulpif(sm.min, sourcemaps.write(sm.settings)))
                .pipe(gulp.dest(params.dest));
        }

        gulp.src(params.file)
            .pipe(gulpif(sm.sass, sourcemaps.init()))
            .pipe(sass(st.compiler_settings).on('error', sass.logError))
            .pipe(postcss(processors))
            .pipe(gulpif(params.rename, rename({basename: params.name, extname: '.css'})))
            .pipe(gulpif(sm.sass, sourcemaps.write(sm.settings)))
            .pipe(gulp.dest(params.dest));
    });
    _taskRegistered(params.task);

    return true;
}

function sassConfig(newConfig) {
    'use strict';
    extend(true, config.styles, newConfig);
}

function stylesFn(src, name, task, srcDir, destination) {
    'use strict';
    var dest = destination || config.styles.dest,
        new_styles_config = {
            src: src || _error('Styles should contain source file(s)'),
            name: name || _error('Styles should contain filename'),
            task: task || (dest + name + '.css'),
            dir: srcDir || '',
            dest: destination || config.styles.dest
        };

    return newStylesTask(new_styles_config);
}

function newStylesTask(params) {
    'use strict';
    prefixSrc(params, params.dir);
    config.styles.modules.push(params);
    _config.tasks.push(params.task);

    var st = config.styles,
        sm = st.sourcemaps,
        processors = _cssProcessors();

    gulp.task(params.task, function () {
        if (st.minify) {
            // clone processors to not break compilation without minification
            var minProcessors = extend([], processors);
            minProcessors.push(cssnano);
            gulp.src(params.src)
                .pipe(gulpif(sm.min, sourcemaps.init()))
                .pipe(concat(params.name + '.min.css'))
                .pipe(postcss(minProcessors))
                .pipe(gulpif(sm.min, sourcemaps.write(sm.settings)))
                .pipe(gulp.dest(params.dest));
        }
        return gulp.src(params.src)
            .pipe(gulpif(sm.concat, sourcemaps.init()))
            .pipe(concat(params.name + '.css'))
            .pipe(postcss(processors))
            .pipe(gulpif(sm.concat, sourcemaps.write(sm.settings)))
            .pipe(gulp.dest(params.dest));
    });
    _taskRegistered(params.task);

    return true;
}

/* /Styles section*/
/* Scripts section*/

function scriptsFn(src, name, task, srcDir, destination) {
    'use strict';
    var dest = destination || config.scripts.dest,
        new_script_config = {
            src: src || _error('Script should contain source file(s)'),
            name: name,
            task: task || (dest + name + '.js'),
            dir: srcDir || config.scripts.dir,
            dest: dest,
            concat: !!name
        };

    return newScriptsTask(new_script_config);
}

function newScriptsTask(params) {
    'use strict';
    prefixSrc(params, params.dir);
    config.scripts.modules.push(params);
    _config.tasks.push(params.task);

    var minify_concat = config.scripts.minify && params.concat,
        minify = config.scripts.minify && !params.concat,
        sm = config.scripts.sourcemaps;

    gulp.task(params.task, function () {
        return gulp.src(params.src)
            .pipe(gulpif(sm.concat, sourcemaps.init()))
            .pipe(gulpif(sm.min && minify_concat, sourcemaps.init()))
            .pipe(gulpif(params.concat, concat(params.name + '.js')))
            .pipe(gulpif(sm.concat, sourcemaps.write(sm.settings)))
            .pipe(gulp.dest(params.dest))
            .pipe(gulpif(minify, foreach(function (stream, file) {
                return stream.pipe(uglify(config.scripts.uglify_settings))
                    .pipe(rename({suffix: '.min'}));
            })))
            .pipe(gulpif(minify, gulp.dest(params.dest)))
            .pipe(gulpif(minify_concat, uglify(config.scripts.uglify_settings)))
            .pipe(gulpif(minify_concat, rename({suffix: '.min'})))
            .pipe(gulpif(sm.min && minify_concat, sourcemaps.write(sm.settings)))
            .pipe(gulpif(minify_concat, gulp.dest(params.dest)));
    });
    _taskRegistered(params.task);

    return true;
}

function scriptsConfig(newConfig) {
    'use strict';
    extend(true, config.scripts, newConfig);
}
/* /Scripts section*/

/* Extra section */

function copyFn(src, destination, task, srcDir) {
    'use strict';
    var params = {
        src: src || _error('Copy should contain source file(s)'),
        dest: destination || _error('Copy should contain destination dir'),
        task: task || _uniqueName(),
        dir: srcDir || ''
    };

    return newCopyTask(params);
}

function newCopyTask(params) {
    'use strict';
    prefixSrc(params, params.dir);
    config.extra.modules.push(params);
    _config.tasks.push(params.task);

    gulp.task(params.task, function () {
        return gulp.src(params.src)
            .pipe(gulp.dest(params.dest));
    });
    _taskRegistered(params.task);

    return true;
}

function addWatch(src, tasksToRun, targetGulp) {
    'use strict';
    var params = {
        src: src || _error('Watch should contain source file(s)!'),
        task: tasksToRun || _error('Watch should task(s) to run!'),
        gulp: targetGulp || _error('Watch should contain gulp instance where is registered task!')
    };

    return newWatchTask(params);
}

function newWatchTask(params) {
    'use strict';
    config.extra.modules.push(params);
    _config.tasks.push([params.task, params.gulp]);
    _taskRegistered(params.task);

    return true;
}

function watchFn() {
    'use strict';
    gulp.start('crip-watch');
}

function tasksFn() {
    'use strict';
    var allTasks = _config.tasks.sort();
    _config.listening = false;
    _title('CripWeb available tasks list: ');
    for (var taskKey in allTasks) {
        if (allTasks.hasOwnProperty(taskKey)) {
            var name = typeof allTasks[taskKey] === 'object' ?
                allTasks[taskKey][0] : allTasks[taskKey];
            _log('    - ', name);
        }
    }
    _config.listening = true;

    return allTasks;
}

/* /Extra section */

// Helpers

function prefixSrc(params, prefix) {
    'use strict';
    if (!prefix)
        return;
    prefix = _trimPath(prefix);

    if (_isLoopable(params.src))
        _loop(params.src, function (value, key) {
            params.src[key] = prefix + '/' + _trimPath(value);
        });
    else if (typeof params.src === 'string')
        params.src = './' + prefix + '/' + _trimPath(params.src);
}

function _cssProcessors() {
    var st = config.styles,
        processors = [];

    // TODO: cssgrace is not compatible with cssnano, find out why
    if (st.cssgrace && false)
        processors.push(cssgrace);

    if (st.autoprefix)
        processors.push(autoprefixer);

    if (st.pixrem)
        processors.push(require('pixrem'));

    return processors;
}

function _loop(data, callback) {
    'use strict';
    if (_isLoopable(data)) {
        for (var index in data)
            if (data.hasOwnProperty(index) && typeof callback === 'function')
                callback(data[index], index);
    }
}

function _trimPath(path) {
    'use strict';
    if (path.charAt(path.length - 1) == "/")
        path = path.substr(0, path.length - 1);

    if (path.charAt(0) == ".")
        path = path.substr(1, path.length);

    if (path.charAt(0) == "/")
        path = path.substr(1, path.length);

    return path;
}

function _uniqueName() {
    'use strict';
    return '_task_' + (config.extra.counter++)
}

function _isLoopable(obj) {
    'use strict';
    return typeof obj === 'array' || typeof obj === 'object';
}

function _error(message) {
    'use strict';
    throw new Error(message);
}

function _taskRegistered(taskName, force) {
    'use strict';
    _log('Task registered: ', taskName, force);
}

function _taskStarted(taskName, force) {
    'use strict';
    _log('Starting task: ', taskName, force);
}

function _log(prefix, content, force) {
    'use strict';
    if (!_config.listening || force) console.log(prefix.yellow + content.green);
}

function _title(text, force) {
    'use strict';
    if (!_config.listening || force) console.log(text.yellow);
}