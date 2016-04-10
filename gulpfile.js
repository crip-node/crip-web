var gulp = require('gulp'),
    cripweb = require('./index.js')(gulp);

cripweb(function (crip) {
    crip.copy('gulpfile', 'gulpfile.js', false)
        .watch('gulpfile', 'gulpfile.js', 'copy-gulpfile')
        .sass('app.scss');
});