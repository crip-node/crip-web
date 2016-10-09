var path = require('path');
var fs = require('fs');
var extend = require('extend');

var crip = require('crip-core');

function Config(defaults) {

    if (defaults)
        this.set(defaults);

    this.assets = this.assets || 'assets';
    this.assetsSrc = this.assetsSrc || '{assets}\\src';
    this.assetsDist = this.assetsDist || '{assets}\\dist';

    // enable CRIP logs in console
    this.log = true;
}

/**
 * Set configuration value to object
 * 
 * @param {String} pathToSet Path to set value separated by dot
 * @param {*} options value to set
 */
Config.prototype.set = function (pathToSet, options) {
    if (typeof options == 'undefined') {
        options = pathToSet;
        pathToSet = null;

        if (typeof options == 'string')
            options = this._readFromFile(options);
    }

    var target = this;

    if (pathToSet) {
        var segments = pathToSet.split('.');
        var key = segments[segments.length - 1];
        target = this.get(pathToSet, true);
        if (crip.isUndefined(target[key]))
            target[key] = {};

        if (crip.isObject(options))
            extend(true, target[key], options);
        else
            target[key] = options;
        return;
    }

    extend(true, target, options);
}

/**
 * Get path from configuration
 * 
 * @param {String} pathToConfig Path to get value separated by dot
 * @param {boolean?} skipLast Skip last property to get reference of it parent
 * @returns {*} Configuration value
 */
Config.prototype.get = function (pathToConfig, skipLast) {
    var self = this;
    var temp = this;
    var segments = pathToConfig.split('.');

    if (skipLast)
        segments = segments.slice(0, -1);

    crip.forEach(segments, function (segment) {
        if (typeof temp[segment] === 'undefined')
            temp[segment] = {};

        temp = temp[segment];
    });

    if (crip.isString(temp) && temp.indexOf('{') > -1) {
        return temp.replace(
            /{([^{}]*)}/g,
            function (a, b) {
                var r = self.get(b);
                return crip.isString(r) || crip.isNumber(r) ? r : a;
            }
        );
    }

    return temp;
}

/**
 * Read json file;
 * 
 * @param {String} pathToFile - Path to the file
 * @returns {Object} Json file content
 */
Config.prototype._readFromFile = function (pathToFile) {
    if (fs.existsSync(pathToFile))
        return JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

    return pathToFile;
}


module.exports = Config;