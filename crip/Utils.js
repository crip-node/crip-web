var colors = require('colors');
var path = require('path');
var crip = require('crip-core');

var utils = {

    /**
     * Determine object/array has value
     *
     * @param {Array|Object} arr
     * @param {any} val
     * @returns {boolean}
     */
    contains: function (arr, val) {
        var result = false;
        crip.forEach(arr, function (arrVal) {
            if (arrVal === val)
                result = true;
        });

        return result;
    },

    /**
     * Append base path for globs
     * 
     * @param {any} options
     * @returns
     */
    appendBase: function (options) {
        if (!options.src || !options.base)
            return;

        var trimRegex = /^\\+|\\+$/g;
        if (typeof options.src === 'object') {
            // treat as array or object
            crip.forEach(options.src, function (dir, key) {
                options.src[key] = path.join(options.base, dir).replace(trimRegex, '');
            })
        } else
            //treat as a string
            options.src = path.join(options.base, options.src).replace(trimRegex, '');
    }
}

module.exports = utils;