var Utils = {
        where: where,
        contains: contains,
        forEach: forEach,
        appendBase: appendBase,
        supplant: supplant
    };
var path = require('path');

module.exports = Utils;

/**
 * Get items witch have same search params
 *
 * @param {Array} arr
 * @param {Array} searchParam
 * @returns {Array}
 */
function where(arr, searchParam) {
    var result = [],
        paramsMatch = [];
    forEach(arr, function (arrVal, i) {
        forEach(searchParam, function (paramVal, j) {
            if (arrVal.hasOwnProperty(j) && paramVal === arrVal[j])
                paramsMatch.push(true);
        });

        if (paramsMatch.length === searchParam.length)
            result.push(arrVal);
        paramsMatch = [];
    });

    return result;
}

/**
 * Determine object/array has value
 *
 * @param {Array|Object} arr
 * @param {any} val
 * @returns {boolean}
 */
function contains(arr, val) {
    forEach(arr, function (arrVal) {
        if (arrVal === val)
            return true;
    });

    return false;
}

/**
 * Loop in object
 *
 * @param {Array|Object} obj
 * @param {function} callback
 */
function forEach(obj, callback) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            callback(obj[i], i);
    }
}

/**
 * Append base path for globs
 * 
 * @param {any} options
 * @returns
 */
function appendBase(options) {
    if (!options.src || !options.base)
        return;

    if (typeof options.src === 'object') {
        // treat as array or object
        Utils.forEach(options.src, function (dir, key) {
            options.src[key] = path.join(options.base, dir);
        })
    } else {
        //treat as a string
        options.src = path.join(options.base, options.src);
    }
}

/**
 * supplant() does variable substitution on the string. It scans through the string looking for 
 * expressions enclosed in { } braces. If an expression is found, use it as a key on the object, 
 * and if the key has a string value or number value, it is substituted for the bracket expression 
 * and it repeats.
 * 
 * @param {String} tmpl
 * @param {Object} o
 * 
 * @returns {String}
 */
function supplant (tmpl, o) {
	return tmpl.replace(
		/{([^{}]*)}/g, 
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};