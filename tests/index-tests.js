var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var fs = require('fs');
var gulp = require('gulp');
var cripUtil = require('./../crip/crip');

chai.use(require('chai-fs'));
chai.use(require('sinon-chai'));

describe('index #copy', function () {

    beforeEach(function () {
        sinon.stub(cripUtil, 'log');
    })

    afterEach(function () {
        cripUtil.log.restore();
    })

    describe('#default', function () {
        it('should execute all defined copy tasks', function (done) {
            var cripweb = require('./../index');
            var methods;

            fs.mkdirSync('./files');
            fs.writeFileSync('./files/m.txt', 'm.txt');
            fs.writeFileSync('./files/n.txt', 'n.txt');

            cripweb(gulp)(function (crip) {
                crip.config.set({
                    copy: { base: './files', output: './files/dist' },
                    watch: { base: './files' }
                });

                methods =
                    crip.copy('task-1', 'm.txt')
                        .copy('task-2', 'n.txt')
                        .watch('task-1', '*.*', ['copy-task-1']);
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');
            expect(gulp.tasks).to.have.property('copy-task-2');
            expect(gulp.tasks).to.have.property('default');
            expect(gulp.tasks).to.have.property('watch-task-1');

            methods.on('finish-default', function () {
                expect('./files/dist/').to.be.a.directory().and.not.empty;
                expect('./files/dist/m.txt').to.be.a.file();
                expect('./files/dist/n.txt').to.be.a.file();

                cripUtil.unlinkDir('./files');
                done();
            });

            gulp.start('default');
        })
    })
});