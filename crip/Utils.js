var Utils = {
    where: where,
    contains: contains,
    forEach: forEach
};

Array.prototype.forEach = forEach;

module.exports = Utils;

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

function contains(arr, val) {
    forEach(arr, function (arrVal) {
        if (arrVal === val)
            return true;
    });

    return false;
}

function forEach(obj, callback) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            callback(obj[i], i);
    }
}