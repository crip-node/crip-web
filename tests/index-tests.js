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

    describe('#default', function () {
        it('should execute all defined tasks fom defaults', function (done) {
            var cripweb = require('./../index');
            var methods;

            if (fs.existsSync('./files'))
                cripCore.unlinkDir('./files');
            fs.mkdirSync('./files');
            fs.writeFileSync('./files/m.txt', 'm.txt');
            fs.writeFileSync('./files/n.txt', 'n.txt');
            fs.writeFileSync('./files/s.js', '(function(crip){ \'use strict\'; crip.noop = function() {return arguments;} })(window.crip || (window.crip = {}))');
            fs.writeFileSync('./files/t.js', '(function(crip){ \'use strict\'; console.log(crip.noop()) })(window.crip || (window.crip = {}))');

            gulp.task('my-custom-name', function () {
                fs.mkdirSync('./files/dist');
                fs.writeFileSync('./files/dist/x.txt', 'x.txt');
            });

            cripweb(gulp)(function (crip) {
                crip.config.set({
                    copy: { base: './files', output: './files/dist' },
                    watch: { base: './files' },
                    scripts: { base: './files', output: './files/dist' }
                });

                methods =
                    crip.addDefault('my-custom-name')
                        .copy('task-1', 'm.txt')
                        .copy('task-2', 'n.txt')
                        .watch('task-1', '*.*', ['copy-task-1'])
                        .scripts('task-1', '*.js', true);
            });

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');
            expect(gulp.tasks).to.have.property('copy-task-2');
            expect(gulp.tasks).to.have.property('default');
            expect(gulp.tasks).to.have.property('watch-task-1');
            expect(gulp.tasks).to.have.property('scripts');
            expect(gulp.tasks).to.have.property('scripts-task-1');

            methods.on('finish-default', function () {
                expect('./files/dist/').to.be.a.directory().and.not.empty;
                expect('./files/dist/m.txt').to.be.a.file().and.not.empty;
                expect('./files/dist/n.txt').to.be.a.file().and.not.empty;
                expect('./files/dist/x.txt').to.be.a.file().and.not.empty;
                expect('./files/dist/task-1.js').to.be.a.file().and.not.empty;
                expect('./files/dist/task-1.min.js').to.be.a.file().and.not.empty;

                cripCore.unlinkDir('./files');
                done();
            });

            gulp.start('default');
        });
    });
});