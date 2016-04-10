var Utils = {
    where: where,
    contains: contains,
    forEach: forEach
};

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
        forEach(searchParam, function(paramVal, j){
            if(arrVal.hasOwnProperty(j) && paramVal === arrVal[j])
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