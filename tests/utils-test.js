var chai = require('chai');
var expect = chai.expect;

var utils = require('./../crip/utils');

describe('Utils', function () {

    it('contains() should find property in array', function () {
        var arr = ['a', 'b', 'c'];
        var search = 'b';

        var result = utils.contains(arr, search);

        expect(typeof result).to.equal('boolean');
        expect(result).to.equal(true);
    })

    it('contains() should NOT find property in array', function () {
        var arr = ['a', 'b', 'c'];
        var search = 'd';

        expect(utils.contains(arr, search)).to.equal(false);
    })

    it('contains() should find property in object', function () {
        var obj = { '1': 'a', '2': 'b', '3': 'c' };
        var search = 'b';

        expect(utils.contains(obj, search)).to.equal(true);
    })

    it('contains() should NOT find property in object', function () {
        var obj = { '1': 'a', '2': 'b', '3': 'c' };
        var search = 'd';

        expect(utils.contains(obj, search)).to.equal(false);
    })

    /*it('forEach() should iterate throuth all properties in array', function () {
        var arr = [1, 2, 3, 4];

        var result = 0;
        utils.forEach(arr, function (val, key) {
            result += val;
        });

        expect(result).to.equal(10);
    })

    it('forEach() should iterate throuth all properties in object', function () {
        var obj = { '1': 'a', '2': 'b', '3': 'c' };

        var result = '';
        utils.forEach(obj, function (val, key) {
            result += val;
        });

        expect(result).to.equal('abc');
    })

    it('appendBase() should concat src string with base string', function () {
        var o = { src: 'src/dir', base: 'root/dir' };
        utils.appendBase(o);

        expect(o.src).to.equal('root\\dir\\src\\dir');
    })*/

    it('appendBase() should concat src string array with base string', function () {
        var o = { src: ['src/dir/1', './../2/src/dir/'], base: 'root/dir' };
        utils.appendBase(o);

        expect(o.src[0]).to.equal('root\\dir\\src\\dir\\1');
        expect(o.src[1]).to.equal('root\\2\\src\\dir');
    })

    /*it('supplant() should replace all occurances', function () {
        var template = 'Hello {Name} {Surname}! You are welkom to {env} Unit test {num}';
        var vars = { Name: 'Igo', Surname: '', env: 'node.js', num: 1, obj: { a: 'b' } };

        expect(utils.supplant(template, vars)).to.equal('Hello Igo ! You are welkom to node.js Unit test 1');
    })*/

    //it('log() should return logged string value', function () {
    //    expect(Utils.log('type', 'event', 'append')).to.equal('['+((new Date).toTimeString()).substr(0, 8) + '] type \'event\' append');
    //})
})