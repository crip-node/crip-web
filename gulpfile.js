var gulp = require('gulp'),
    cripweb = require('./index.js');

cripweb(gulp)(function (crip) {
    crip.copy('copy-1', ['a.txt', 'b.txt'], 'tests/dist', 'tests/src');
});