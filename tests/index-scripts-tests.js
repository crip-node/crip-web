var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var fs = require('fs');
var gulp = require('gulp');
var cripCore = require('crip-core');

chai.use(require('chai-fs'));
chai.use(require('sinon-chai'));

describe('index #scripts', function () {
    beforeEach(function () {
        sinon.stub(cripCore, 'log');
    });

    afterEach(function () {
        cripCore.log.restore();
    });

    it('should copy and minify two files', function (done) {
        var conf = { assetsSrc: './files-s-1', scripts: { base: '{assetsSrc}', output: '{assetsSrc}/dist' } };
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-s-1'))
            cripCore.unlinkDir('./files-s-1');
        fs.mkdirSync('./files-s-1');
        fs.writeFileSync('./files-s-1/o.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
        fs.writeFileSync('./files-s-1/p.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

        cripweb(gulp, conf)(function (crip) {
            methods = crip.scripts('task-1', ['o.js', 'p.js']);

            expect(crip.config.get('scripts.base')).to.be.equal('./files-s-1');
            expect(crip.config.get('scripts.output')).to.be.equal('./files-s-1/dist');
        });

        expect(gulp.tasks).to.have.property('scripts');
        expect(gulp.tasks).to.have.property('scripts-task-1');

        methods.on('finish-scripts-task-1', function () {
            expect('./files-s-1/dist/').to.be.a.directory().and.not.empty;
            expect('./files-s-1/dist/o.js').to.be.a.file();
            expect('./files-s-1/dist/o.min.js').to.be.a.file();
            expect('./files-s-1/dist/p.js').to.be.a.file();
            expect('./files-s-1/dist/p.min.js').to.be.a.file();

            cripCore.unlinkDir('./files-s-1');
            done();
        });

        gulp.start('scripts-task-1');
    });

    it('should concat and minify two files in to one named file', function (done) {
        var conf = { scripts: { base: 'files-s-2', output: 'files-s-2/dist' } };
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-s-2'))
            cripCore.unlinkDir('./files-s-2');
        fs.mkdirSync('./files-s-2');
        fs.writeFileSync('./files-s-2/q.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
        fs.writeFileSync('./files-s-2/r.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

        cripweb(gulp, conf)(function (crip) {
            methods = crip.scripts('task-1', ['q.js', 'r.js'], 'task-1-file.js');
        });

        methods.on('finish-scripts-task-1', function () {
            expect('./files-s-2/dist/').to.be.a.directory().and.not.empty;
            expect('./files-s-2/dist/task-1-file.js').to.be.a.file().and.not.empty;
            expect('./files-s-2/dist/task-1-file.js').to.have.content.that.match(/\.noop \= function/);
            expect('./files-s-2/dist/task-1-file.js').to.have.content.that.match(/\.noop\(\)/);
            expect('./files-s-2/dist/task-1-file.js').to.have.content.that.match(/\/\/\# sourceMappingURL\=data\:application\/json\;base64/);
            expect('./files-s-2/dist/task-1-file.min.js').to.be.a.file().and.not.empty;
            expect('./files-s-2/dist/task-1-file.min.js').to.have.content.that.match(/\.noop\=function/);
            expect('./files-s-2/dist/task-1-file.min.js').to.have.content.that.match(/\.noop\(\)/);

            cripCore.unlinkDir('./files-s-2');
            done();
        });

        gulp.start('scripts-task-1');
    });

    it('should concat and minify two files in to one file named by task', function (done) {
        var conf = { assetsSrc: './files-s-3', scripts: { base: '{assetsSrc}', output: '{assetsSrc}/dist' } };
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-s-3'))
            cripCore.unlinkDir('./files-s-3');
        fs.mkdirSync('./files-s-3');
        fs.writeFileSync('./files-s-3/s.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
        fs.writeFileSync('./files-s-3/t.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

        cripweb(gulp, conf)(function (crip) {
            methods = crip.scripts('task-1', ['s.js', 't.js'], true);
        });

        methods.on('finish-scripts-task-1', function () {
            expect('./files-s-3/dist/').to.be.a.directory().and.not.empty;
            expect('./files-s-3/dist/task-1.js').to.be.a.file().and.not.empty;
            expect('./files-s-3/dist/task-1.min.js').to.be.a.file().and.not.empty;

            cripCore.unlinkDir('./files-s-3');
            done();
        });

        gulp.start('scripts-task-1');
    });

    it('should only concat two files if uglify is disabled', function (done) {
        var conf = { scripts: { base: 'files-s-4', output: 'files-s-4/dist', uglify: { enabled: false } } };
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-s-4'))
            cripCore.unlinkDir('./files-s-4');
        fs.mkdirSync('./files-s-4');
        fs.writeFileSync('./files-s-4/u.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
        fs.writeFileSync('./files-s-4/v.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

        cripweb(gulp, conf)(function (crip) {
            methods = crip.scripts('task-1', '*.js', true);
        });

        methods.on('finish-scripts-task-1', function () {
            expect('./files-s-4/dist/').to.be.a.directory().and.not.empty;
            expect('./files-s-4/dist/task-1.js').to.be.a.file().and.not.empty;
            expect('./files-s-4/dist/task-1.min.js').to.not.be.a.path();

            cripCore.unlinkDir('./files-s-4');
            done();
        });

        gulp.start('scripts-task-1');
    });

    it('should use prependPath and dist from parameters if presented', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-s-5'))
            cripCore.unlinkDir('./files-s-5');
        fs.mkdirSync('./files-s-5');
        fs.writeFileSync('./files-s-5/w.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
        fs.writeFileSync('./files-s-5/x.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

        cripweb(gulp)(function (crip) {
            methods = crip.scripts('task-1', './**/*.js', './files-s-5/dist', 'true', './files-s-5');
        });

        methods.on('finish-scripts-task-1', function () {
            expect('./files-s-5/dist').to.be.a.directory().and.not.empty;
            expect('./files-s-5/dist/true.js').to.be.a.file().and.not.empty;
            expect('./files-s-5/dist/true.min.js').to.be.a.file().and.not.empty;

            cripCore.unlinkDir('./files-s-5');
            done();
        });

        gulp.start('scripts-task-1');

    });

});