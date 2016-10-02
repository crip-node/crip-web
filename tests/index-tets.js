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
        if (!fs.existsSync('./tests/index-files'))
            fs.mkdirSync('./tests/index-files');

        if (!fs.existsSync('./tests/index-files/a.txt'))
            fs.writeFileSync('./tests/index-files/a.txt', '(function(var1){console.log(var1);if(typeof var1 === "number") if(var1 > 1) alert(var1*10)})(5)');

        if (!fs.existsSync('./tests/index-files/b.txt'))
            fs.writeFileSync('./tests/index-files/b.txt', '/*Content of b.txt file*/');
    })

    afterEach(function () {
        cripUtil.log.restore();
        cripUtil.unlinkDir('./tests/index-files');
    })

    describe('#copy', function () {
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

                expect('./tests/index-files-dist/a.txt').to.be.a.path();

                done();
            });
        })
    });

});