var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var fs = require('fs');
var gulp = require('gulp');
var cripCore = require('crip-core');

chai.use(require('chai-fs'));
chai.use(require('sinon-chai'));

describe('index #copy', function () {

    beforeEach(function () {
        sinon.stub(cripCore, 'log');
    });

    afterEach(function () {
        cripCore.log.restore();
    });

    it('should copy single file if globs is direct file path', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-1'))
            cripCore.unlinkDir('./files-c-1');
        fs.mkdirSync('./files-c-1');
        fs.writeFileSync('./files-c-1/a.txt', 'a.txt');

        cripweb(gulp)(function (crip) {
            methods = crip.copy('task-1', './files-c-1/a.txt', 'files-c-1/dist');
        });

        expect(gulp.tasks).to.have.property('copy');
        expect(gulp.tasks).to.have.property('copy-task-1');

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-1/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-1/dist/a.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-1');
            done();
        });

        gulp.start('copy-task-1');
    });

    it('should copy single file if globs is direct file path and base path presented', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-2'))
            cripCore.unlinkDir('./files-c-2');
        fs.mkdirSync('./files-c-2');
        fs.mkdirSync('./files-c-2/sub');
        fs.writeFileSync('./files-c-2/sub/b.txt', 'b.txt');

        cripweb(gulp)(function (crip) {
            methods = crip.copy('task-1', 'b.txt', './files-c-2/dist', './files-c-2/sub');
        });

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-2/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-2/dist/b.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-2');
            done();
        });

        gulp.start('copy-task-1');
    });

    it('should copy glob array if base presented', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-3'))
            cripCore.unlinkDir('./files-c-3');
        fs.mkdirSync('./files-c-3');
        fs.writeFileSync('./files-c-3/c.txt', 'c.txt');
        fs.writeFileSync('./files-c-3/d.txt', 'd.txt');

        cripweb(gulp)(function (crip) {
            methods = crip.copy('task-1', ['c.txt', 'd.txt'], './files-c-3/dist', './files-c-3');
        });
        gulp.start('copy-task-1');

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-3/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-3/dist/c.txt').to.be.a.file();
            expect('./files-c-3/dist/d.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-3');
            done();
        });
    });

    it('should copy glob array if outputPath and prependPath is set on crip create', function (done) {
        var conf = {
            copy: {
                base: './files-c-4',
                output: './files-c-4/dist'
            }
        };
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-4'))
            cripCore.unlinkDir('./files-c-4');
        fs.mkdirSync('./files-c-4');
        fs.writeFileSync('./files-c-4/e.txt', 'e.txt');
        fs.writeFileSync('./files-c-4/f.txt', 'f.txt');

        cripweb(gulp, conf)(function (crip) {
            methods = crip.copy('task-1', ['e.txt', 'f.txt']);
        });
        gulp.start('copy-task-1');

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-4/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-4/dist/e.txt').to.be.a.file();
            expect('./files-c-4/dist/f.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-4');
            done();
        });
    });

    it('should copy glob expression if outputPath and prependPath is set before calling copy', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-5'))
            cripCore.unlinkDir('./files-c-5');
        fs.mkdirSync('./files-c-5');
        fs.writeFileSync('./files-c-5/g.txt', 'g.txt');
        fs.writeFileSync('./files-c-5/h.txt', 'h.txt');

        cripweb(gulp)(function (crip) {
            crip.config.set('copy', {
                base: './files-c-5',
                output: './files-c-5/dist'
            });

            methods = crip.copy('task-1', '*.*');
        });

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-5/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-5/dist/g.txt').to.be.a.file();
            expect('./files-c-5/dist/h.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-5');
            done();
        });

        gulp.start('copy-task-1');
    });

    it('should copy glob expression if outputPath and prependPath are expressions', function (done) {
        var cripweb = require('./../index');
        var methods;
        var config = {
            testRoot: './',
            root: '{copy.testRoot}/files-c-6',
            base: '{copy.root}',
            output: '{copy.root}/dist'
        };

        if (fs.existsSync('./files-c-6'))
            cripCore.unlinkDir('./files-c-6');
        fs.mkdirSync('./files-c-6');
        fs.writeFileSync('./files-c-6/i.txt', 'i.txt');
        fs.writeFileSync('./files-c-6/j.txt', 'j.txt');

        cripweb(gulp)(function (crip) {
            crip.config.set('copy', config);

            methods = crip.copy('task-1', '*.*');
        });

        methods.on('finish-copy-task-1', function () {
            expect('./files-c-6/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-6/dist/i.txt').to.be.a.file();
            expect('./files-c-6/dist/j.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-6');
            done();
        });

        gulp.start('copy-task-1');
    });

    it('should execute 2 tasks when running root task', function (done) {
        var cripweb = require('./../index');
        var methods;

        if (fs.existsSync('./files-c-7'))
            cripCore.unlinkDir('./files-c-7');
        fs.mkdirSync('./files-c-7');
        fs.writeFileSync('./files-c-7/k.txt', 'k.txt');
        fs.writeFileSync('./files-c-7/l.txt', 'l.txt');

        cripweb(gulp)(function (crip) {
            crip.config.set('copy', {
                base: './files-c-7',
                output: './files-c-7/dist'
            });

            methods =
                crip.copy('task-1', 'k.txt')
                    .copy('task-2', 'l.txt');
        });

        expect(gulp.tasks).to.have.property('copy');
        expect(gulp.tasks).to.have.property('copy-task-1');
        expect(gulp.tasks).to.have.property('copy-task-2');

        methods.on('finish-copy', function () {
            expect('./files-c-7/dist/').to.be.a.directory().and.not.empty;
            expect('./files-c-7/dist/k.txt').to.be.a.file();
            expect('./files-c-7/dist/l.txt').to.be.a.file();

            cripCore.unlinkDir('./files-c-7');
            done();
        });

        gulp.start('copy');
    });

});