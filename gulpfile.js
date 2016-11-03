var gulp = require('gulp'),
    cripweb = require('./index.js');

gulp.task('test-1', function (done) {
    console.log('test 1 executed');
    done();
});

gulp.task('test-2', function (done) {
    console.log('test 2 executed');
    done();
});

cripweb(gulp)(function (crip) {
    crip.copy('task-1', 'a.txt', 'tests/files/dist', 'tests/index-files')
        .copy('task-2', 'b.txt', 'tests/files/dist', 'tests/index-files');

    crip.watch('some', 'tests/*.js', ['test-1', 'test-2']);
});