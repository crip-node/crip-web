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
        if (!fs.existsSync('./tests/files'))
            fs.mkdirSync('./tests/files');

        if (!fs.existsSync('./tests/files/a.txt'))
            fs.writeFileSync('./tests/files/a.txt', '(function(var1){console.log(var1);if(typeof var1 === "number") if(var1 > 1) alert(var1*10)})(5)');

        if (!fs.existsSync('./tests/files/b.txt'))
            fs.writeFileSync('./tests/files/b.txt', '/*Content of b.txt file*/');
    })

    afterEach(function () {
        //cripUtil.unlinkDir('./tests/files');
    })

    describe('#copy', function () {
        it('should copy single file if globs is sirect file path', function () {
            var cripweb = require('./../index')(gulp);
            cripweb(function (crip) {
                crip.copy('task-1', './tests/files/a.txt', './tests/files/dist');
            })

            expect(gulp.tasks).to.have.property('copy');
            expect(gulp.tasks).to.have.property('copy-task-1');

            gulp.start('copy-task-1');
            // in gulp 4 it will be 'series' method

        })
    });

});