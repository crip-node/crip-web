var gulp = require('gulp'),
    cripweb = require('./index.js');

cripweb(gulp)(function (crip) {
    crip.copy('task-1', ['a.txt', 'b.txt'], 'tests/dist', 'tests/src')
        .copy('task-2', ['a.txt', 'b.txt'], 'tests/dist', 'tests/src');
});