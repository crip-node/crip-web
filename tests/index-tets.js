var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var fs = require('fs');
var gulp = require('gulp');
var cripUtil = require('./../crip/crip');

chai.use(require('chai-fs'));
chai.use(require('sinon-chai'));

describe('index', function () {

    beforeEach(function () {
        sinon.stub(cripUtil, 'log');
    })

    afterEach(function () {
        cripUtil.unlinkDir('./files');
        cripUtil.log.restore();
    })

    describe('#copy', function () {
        var cripConfig = {
            copy: {
                base: './files',
                output: './files/dist'
            }
        };

        it('should copy single file if globs is direct file path', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/a.txt', 'a.txt');

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', './files/a.txt', 'files/dist');
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/a.txt').to.be.a.path();
                
                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('copy-task-1');
        })

        it('should copy single file if globs is direct file path and base path presented', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.mkdirSync('./files/sub');
            fs.writeFileSync('./files/sub/b.txt', 'b.txt');

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', 'b.txt', './files/dist', './files/sub');
            })

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/b.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('copy-task-1');
        })

        it('should copy glob array if base presented', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/c.txt', 'c.txt');
            fs.writeFileSync('./files/d.txt', 'd.txt');

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', ['c.txt', 'd.txt'], './files/dist', './files');
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/c.txt').to.be.a.path();
                expect('./files/dist/d.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });
        })

        it('should copy glob array if outputPath and prependPath is set on crip create', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/e.txt', 'e.txt');
            fs.writeFileSync('./files/f.txt', 'f.txt');

            cripweb(gulp, cripConfig)(function (crip) {
                methods = crip.copy('task-1', ['e.txt', 'f.txt']);
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/e.txt').to.be.a.path();
                expect('./files/dist/f.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });
        })

        it('should copy glob expression if outputPath and prependPath is set before calling copy', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/g.txt', 'g.txt');
            fs.writeFileSync('./files/h.txt', 'h.txt');

            cripweb(gulp)(function (crip) {
                crip.config.set('copy', cripConfig.copy);

                methods = crip.copy('task-1', '*.*');
            })

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/g.txt').to.be.a.path();
                expect('./files/dist/h.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('copy-task-1');
        })

        it('should copy glob expression if outputPath and prependPath are expressions', function (done) {
            var cripweb = require('./../index');
            var methods;
            var config = {
                testRoot: './',
                root: '{copy.testRoot}/files',
                base: '{copy.root}',
                output: '{copy.root}/dist'
            };

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/i.txt', 'i.txt');
            fs.writeFileSync('./files/j.txt', 'j.txt');

            cripweb(gulp)(function (crip) {
                crip.config.set('copy', config);

                methods = crip.copy('task-1', '*.*');
            })

            methods.on('finish-copy-task-1', function () {
                expect('./files/dist/i.txt').to.be.a.path();
                expect('./files/dist/j.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('copy-task-1');
        })

        it('should execute 2 tasks when running root task', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/k.txt', 'k.txt');
            fs.writeFileSync('./files/l.txt', 'l.txt');

            cripweb(gulp)(function (crip) {
                crip.config.set('copy', cripConfig.copy);

                methods =
                    crip.copy('task-1', 'k.txt')
                        .copy('task-2', 'l.txt');
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');
            expect(gulp.tasks).to.have.property('copy-task-2');

            methods.on('finish-copy', function () {
                expect('./files/dist/k.txt').to.be.a.path();
                expect('./files/dist/l.txt').to.be.a.path();

                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('copy');
        })

    });

    describe('#default', function () {
        /*it('should execute all defined copy tasks', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp)(function (crip) {
                crip.config.set({
                    copy: { base: './tests/index-files', output: './tests/index-files/dist' },
                    watch: { base: './tests/index-files' }
                });

                methods =
                    crip.copy('task-1', 'a.txt')
                        .copy('task-2', 'b.txt')
                        .watch('task-1', '*.*', ['copy-task-1']);
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');
            expect(gulp.tasks).to.have.property('copy-task-2');
            expect(gulp.tasks).to.have.property('default');
            expect(gulp.tasks).to.have.property('watch-task-1');

            methods.on('finish-default', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });

            gulp.start('default');
        })*/
    })
});