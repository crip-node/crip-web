var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var events = require('events');
var fs = require('fs');

var crip = require('crip-core');

var Config = require('./../../crip/Config');

describe('Config', function () {

    it('constructor() should define default properties', function () {
        var config = new Config();

        expect(config).to.have.property('log', true);
        expect(config).to.have.property('assets', 'assets');
        expect(config).to.have.property('assetsSrc', '{assets}\\src');
        expect(config).to.have.property('assetsDist', '{assets}\\dist');
    });

    it('constructor() should clone properties from passed defaults', function () {
        var config = new Config({ test: true, test2: { test: 'level-2' } });

        expect(config).to.have.property('test', true);
        expect(config).to.have.property('test2');
        expect(config.test2).to.have.property('test', 'level-2');
    });

    it('get() should get root property', function () {
        var config = new Config({ test: true, test2: { test: 'level-2' } });

        expect(config.get('test')).to.equal(true);
    });

    it('get() should return inner property if "." is presented', function () {
        var config = new Config({ test: true, test2: { test: 'level-2', test3: { test4: 3 } } });

        expect(config.get('test2.test')).to.equal('level-2');
        expect(config.get('test2.test3.test4')).to.equal(3);
    });

    it('get() should return parent if argument 2 is true', function () {
        var config = new Config({ test: true, test2: { test: 'level-2', test3: { test4: 3 } } });

        expect(config.get('test2.test3.test4', true)).to.have.property('test4', 3);
        expect(config.get('log', true)).to.have.property('log', true);
    });

    it('get() should supplant value if it is string', function () {
        var config = new Config({ assets: 'test1', test2: { a: 'a-val' }, test3: '{assets}/{test2.a}/{assetsSrc}' });

        expect(config.get('assetsSrc')).to.equal('test1\\src');
        expect(config.get('test3')).to.equal('test1/a-val/test1\\src');
    });

    it('set() should set object to undefinded path', function () {
        var config = new Config();

        config.set('test1', 'test1');
        config.set('test2', { test2: 'test2-value' });

        expect(config).to.have.property('test1', 'test1');
        expect(config).to.have.property('test2');
        expect(config.test2).to.have.property('test2', 'test2-value');
    });

    it('set() should owervrite values adedd in constructor', function () {
        var config = new Config({ test1: 1, test2: { test2: 2 } });

        config.set('test1', 2);
        config.set('test2.test2', 3);
        config.set('test2', { test3: 4 });

        expect(config).to.have.property('test1', 2);
        expect(config.test2).to.have.property('test2', 3);
        expect(config.test2).to.have.property('test3', 4);
    });

    it('set() should set configurations from file', function () {
        if (fs.existsSync('./tests/files'))
            crip.unlinkDir('./tests/files');

        fs.mkdirSync('./tests/files');
        fs.writeFileSync('./tests/files/config-tests-1.json', '{"test1":"test-1-value"}');

        var config = new Config('./tests/files/config-tests-1.json');

        expect(config).to.have.property('test1', 'test-1-value');
        crip.unlinkDir('./tests/files');

    });
});