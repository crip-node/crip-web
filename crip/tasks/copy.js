var gulp = require('gulp'),
    cripweb = require('cripweb')(gulp);

cripweb.extend('copy', copy);

function copy(task, src, dest) {
    new cripweb.Task('copy', task, function(){
        return (
            gulp
                .src(src)
                .pipe(gulp.dest(dest))
        );
    });
}