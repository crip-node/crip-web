var gulp = require('gulp'),
    Crip = require('cripweb');

Crip.extend('copy', copy);

function copy(task, src, dest) {
    new Crip.Task('copy', task, function(){
        return (
            gulp
                .src(src)
                .pipe(gulp.dest(dest))
        );
    });
}