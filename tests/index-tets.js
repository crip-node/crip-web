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
        cripUtil.unlinkDir('./tests/index-files/dist');
        cripUtil.log.restore();
    })

    describe('#copy', function () {
        var cripConfig = {
            copy: {
                base: './tests/index-files',
                output: './tests/index-files/dist'
            }
        };

        it('should copy single file if globs is direct file path', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', './tests/index-files/a.txt', 'tests/index-files/dist');
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');

            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                done();
            });
        })

        it('should copy single file if globs is direct file path and base path presented', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', 'b.txt', './tests/index-files/dist', './tests/index-files');
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });
        })

        it('should copy glob array if base presented', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp)(function (crip) {
                methods = crip.copy('task-1', ['a.txt', 'b.txt'], './tests/index-files/dist', './tests/index-files');
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });
        })

        it('should copy glob array if outputPath and prependPath is set on crip create', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp, cripConfig)(function (crip) {
                methods = crip.copy('task-1', ['a.txt', 'b.txt']);
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });
        })

        it('should copy glob expression if outputPath and prependPath is set before calling copy', function (done) {
            var cripweb = require('./../index');
            var methods;

            cripweb(gulp)(function (crip) {
                crip.config.set('copy', cripConfig.copy);

                methods = crip.copy('task-1', '*.*');
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });
        })

        it('should copy glob expression if outputPath and prependPath are expressions', function (done) {
            var cripweb = require('./../index');
            var methods;
            var config = {
                testRoot: './tests',
                root: '{copy.testRoot}/index-files',
                base: '{copy.root}',
                output: '{copy.root}/dist'
            };

            cripweb(gulp)(function (crip) {
                crip.config.set('copy', config);

                methods = crip.copy('task-1', '*.*');
            })
            gulp.start('copy-task-1');

            methods.on('finish-copy-task-1', function () {
                expect('./tests/index-files/dist/a.txt').to.be.a.path();
                expect('./tests/index-files/dist/b.txt').to.be.a.path();
                done();
            });
        })

    });

});