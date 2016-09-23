var colors = require('colors');

var Utils = {
    /*where: where,*/
    contains: contains,
    forEach: forEach,
    appendBase: appendBase,
    supplant: supplant,
    log: log
};
var path = require('path');

module.exports = Utils;

/**
 * Determine object/array has value
 *
 * @param {Array|Object} arr
 * @param {any} val
 * @returns {boolean}
 */
function contains(arr, val) {
    var result = false;
    forEach(arr, function (arrVal) {
        if (arrVal === val)
            result = true;
    });

    return result;
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

    var trimRegex = /^\\+|\\+$/g;
    if (typeof options.src === 'object') {
        // treat as array or object
        forEach(options.src, function (dir, key) {
            options.src[key] = path.join(options.base, dir).replace(trimRegex, '');
        })
    } else
        //treat as a string
        options.src = path.join(options.base, options.src).replace(trimRegex, '')
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
function supplant(tmpl, o) {
    return tmpl.replace(
        /{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

/**
 * Log custom event to console
 * 
 * @param {String} type
 * @param {String} event
 * @param {?String} append
 */
function log(type, event, append) {
    var text = timestamp() + (' ' + type + ' ').magenta + ('\'' + event + '\'').cyan + (append ? (' ' + append) : '').magenta;
    console.log(text);

    return text;
    /**
     * Get Current tymestamp formatted String
     * 
     * @returns {String}
     */
    function timestamp() {
        return ('[' + ((new Date).toTimeString()).substr(0, 8) + ']').grey;
    }
}