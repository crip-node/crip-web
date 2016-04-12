var gulp = require('gulp'),
    cripweb = require('./index.js')(gulp);

cripweb(function (crip) {
    crip.copy('gulpfile', 'gulpfile.js', false)
        .watch('gulpfile', 'gulpfile.js', 'copy-gulpfile')
        .sass('app.scss')
        .styles('test', ['src/**/*.css', 'build/css/app.css'], 'assets/build/css', 'test', 'assets');
});