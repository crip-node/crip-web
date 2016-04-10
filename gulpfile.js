var gulp = require('gulp'),
    watch = require('gulp-watch'),
    cripweb = require('./index.js')(gulp);

cripweb(function (crip) {
    crip.copy('file', 'package.json', 'test');
});