var gulp = require('gulp'),
    cripweb = require('./index.js');

cripweb(gulp, {log: false})(function (crip) {
    crip.copy('gulpfile', 'gulpfile.js', false)
        .watch('gulpfile', 'gulpfile.js', 'copy-gulpfile')
        .sass('app.scss')
        .styles('test', ['src/**/*.css', 'build/css/app.css'], 'assets/build/css', 'test', 'assets')
        .scripts('task-name', ['js/*.js', 'vendor/**/*.js'], 'assets/build/js', 'file-name', 'base-dir');
});