function Copy(Crip, gulp) {
    Crip.extend('copy', copy);

    function copy(name, src, dist) {
        new Crip.Task('copy', name, action, src);

        function action() {
            gulp.src(src)
                .pipe(gulp.dest(dist));
        }

        // allow chain methods
        return Crip.core;
    }
}

module.exports = function (Crip, gulp) {
    new Copy(Crip, gulp);

    return Crip.core;
};