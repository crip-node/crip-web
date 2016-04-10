var Utils = {
        where: where,
        contains: contains,
        forEach: forEach,
        appendBase: appendBase
    },
    path = require('path');

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
 * Determine array has value
 *
 * @param arr
 * @param val
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

function appendBase(options) {
    if (!options.src || !options.base)
        return;

    if (typeof options.src === 'object') {
        Utils.forEach(options.src, function (dir, key) {
            options.src[key] = path.join(options.base, dir);
        })
    } else {
        options.src = path.join(options.base, options.src);
    }
}