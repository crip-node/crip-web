var gulp = require('gulp'),
    cripweb = require('./index.js');

cripweb(gulp)(function (crip) {
    crip.copy('task-1', ['a.txt', 'b.txt'], 'tests/files/dist', 'tests/index-files')
        .copy('task-2', ['a.txt', 'b.txt'], 'tests/files/dist', 'tests/index-files');
});