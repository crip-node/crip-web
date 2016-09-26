var chai = require('chai');
var sinon = require('sinon');
var fs = require('fs');
var expect = chai.expect;

chai.use(require('chai-fs'));

var crip = require('./../crip/crip');

describe('crip', function () {

    it('isDefined() should return true on passing existing/non reference', function () {
        expect(crip.isDefined({})).to.be.ok;

        expect(crip.isDefined({}.a)).to.not.be.ok;
    })

    it('isUndefined() should return false on passing existing/non reference', function () {
        expect(crip.isUndefined({}.a)).to.be.ok;

        expect(crip.isUndefined({})).to.not.be.ok;
    })

    it('isObject() should return true on passing object', function () {
        expect(crip.isObject({})).to.be.ok;
        expect(crip.isObject([])).to.be.ok;

        expect(crip.isObject(null)).to.not.be.ok;
        expect(crip.isObject({}.c)).to.not.be.ok;
        expect(crip.isObject('string')).to.not.be.ok;
        expect(crip.isObject(1)).to.not.be.ok;
        expect(crip.isObject(NaN)).to.not.be.ok;
    })

    it('isString() should return true an passing valid string object', function () {
        expect(crip.isString(' ')).to.be.ok;

        expect(crip.isString(1234)).to.not.be.ok;
        expect(crip.isString(NaN)).to.not.be.ok;
        expect(crip.isString([])).to.not.be.ok;
        expect(crip.isString(crip.noop)).to.not.be.ok;
        expect(crip.isString(null)).to.not.be.ok;
    })

    it('isNumber() should return true an passing valid number', function () {
        expect(crip.isNumber(123)).to.be.ok;
        expect(crip.isNumber(NaN)).to.be.ok;

        expect(crip.isNumber('string')).to.not.be.ok;
        expect(crip.isNumber([])).to.not.be.ok;
        expect(crip.isNumber(crip.noop)).to.not.be.ok;
        expect(crip.isNumber(null)).to.not.be.ok;
        expect(crip.isNumber({})).to.not.be.ok;
    })

    it('isArray() should return true on valid array object', function () {
        expect(crip.isObject([])).to.be.ok;
        expect(crip.isObject({})).to.be.ok;

        expect(crip.isObject({}.c)).to.not.be.ok;
        expect(crip.isObject(null)).to.not.be.ok;
        expect(crip.isObject('string')).to.not.be.ok;
        expect(crip.isObject(1)).to.not.be.ok;
        expect(crip.isObject(NaN)).to.not.be.ok;
        expect(crip.isObject(crip.noop)).to.not.be.ok;
    })

    it('isFunction() should return true on valid array object', function () {
        expect(crip.isFunction(crip.noop)).to.be.ok;

        expect(crip.isFunction([])).to.not.be.ok;
        expect(crip.isFunction({})).to.not.be.ok;
        expect(crip.isFunction({}.c)).to.not.be.ok;
        expect(crip.isFunction(null)).to.not.be.ok;
        expect(crip.isFunction('string')).to.not.be.ok;
        expect(crip.isFunction(1)).to.not.be.ok;
        expect(crip.isFunction(NaN)).to.not.be.ok;
    })

    it('toInt() should convert string to integer', function () {
        var value1 = '100';
        var value2 = 'a';

        var result1 = crip.toInt(value1);
        var result2 = crip.toInt(value2);

        expect(typeof result1).to.equal('number');
        expect(typeof result2).to.equal('number');
        expect(result1).to.equal(100);
    })

    it('forEach() should iterate throuth all properties in array', function () {
        var arr = [1, 2, 3, 4];

        var result = 0;
        crip.forEach(arr, function (val, key) {
            result += val + crip.toInt(key);
        });

        expect(result).to.equal(16);
    })

    it('forEach() should iterate throuth all properties in object', function () {
        var obj = { '1': 'a', '2': 'b', '3': 'c' };

        var result = '';
        crip.forEach(obj, function (val, key) {
            result += key + val;
        });

        expect(result).to.equal('1a2b3c');
    })

    it('supplant() should replace all occurances', function () {
        var template = 'Hello {Name} {Surname}! You are welkom to {env} Unit test {num}';
        var vars = { Name: 'Igo', Surname: '', env: 'node.js', num: 1, obj: { a: 'b' } };

        expect(crip.supplant(template, vars)).to.equal('Hello Igo ! You are welkom to node.js Unit test 1');
    })

    it('unlinkDir() should delete dir with folder', function () {

        if (!fs.existsSync('./tests/files'))
            fs.mkdirSync('./tests/files');

        if (!fs.existsSync('./tests/files/crip-test'))
            fs.mkdirSync('./tests/files/crip-test');

        if (!fs.existsSync('./tests/files/crip-test/1'))
            fs.writeFileSync('./tests/files/crip-test/1', '1');

        if (!fs.existsSync('./tests/files/crip-test/2'))
            fs.writeFileSync('./tests/files/crip-test/2', '2');

        crip.unlinkDir('./tests/files');

        expect('./tests/files/crip-test').to.not.be.a.path();
    })
})