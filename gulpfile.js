var gulp = require('gulp'),
    cripweb = require('./index.js');

cripweb(gulp)(function (crip) {
    crip.config.set('js.uglify.enabled', true)
        //.config.set('settings.json')
        .config.set({'log': false})
        .config.set({js: {sourcemaps: {enabled: false}}});

    console.log(crip.config.get('js'));

    crip.copy('gulpfile', 'gulpfile.js', false)
        .watch('gulpfile', 'gulpfile.js', 'copy-gulpfile')
        .sass('app.scss')
        .styles('test', ['src/**/*.css', 'build/css/app.css'], 'assets/build/css', 'test', 'assets')
        .scripts('task-name', ['**/*.js']);
});