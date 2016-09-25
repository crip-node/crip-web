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

    it('appendBase() should concat src string array with base string', function () {
        var o = { src: ['src/dir/1', './../2/src/dir/'], base: 'root/dir' };
        utils.appendBase(o);

        expect(o.src[0]).to.equal('root\\dir\\src\\dir\\1');
        expect(o.src[1]).to.equal('root\\2\\src\\dir');
    })
})