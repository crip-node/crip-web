var fs = require('fs');
var path = require('path')

var crip = {

    /**
     * A function that performs no operations. This function can be useful when writing code in the
     * functional style.
      ```js
        function foo(callback) {
            var result = calculateResult();
            (callback || crip.noop)(result);
        }
      ```
     */
    noop: function () { return arguments; },

    /**
     * Determines if a reference is defined.
     * 
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    isDefined: function (value) {
        return typeof value !== 'undefined';
    },

    /**
     * Determines if a reference is undefined.
     * 
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined.
     */
    isUndefined: function (value) {
        return !this.isDefined(value);
    },

    /**
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     * 
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    isObject: function (value) {
        return value !== null && typeof value === 'object';
    },

    /**
     * Determines if a reference is a `String`.
     * 
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    isString: function (value) {
        return typeof value === 'string';
    },

    /**
     * Determines if a reference is a `Number`.
     * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
     * 
     * @param {*} value
     * @returns {boolean} True if `value` is a `Number`.
     */
    isNumber: function (value) {
        return typeof value === 'number';
    },

    isArray: Array.isArray,

    /**
     * Determines if a reference is a `Function`.
     * 
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    isFunction: function (value) {
        return typeof value === 'function';
    },

    /**
     * Determines if a reference is a `Boolean`.
     * 
     * @param {any} value Reference to check.
     * @returns {boolean} True if `value` is a `Boolean`.
     */
    isBoolean: function (value) {
        return typeof value === 'boolean';
    },

    /**
     * Parse string to int.
     * 
     * @param {String} str String to parse.
     * @returns {Number} Converted value of str.
     */
    toInt: function (str) {
        return parseInt(str, 10);
    },

    /**
     * Loop in object/array
     *
     * @param {Array|Object} obj Object to iterate over.
     * @param {Function} iterator Iterator function.
     * @returns {Object|Array} Reference to `obj`.
     */
    forEach: function (obj, iterator) {
        for (var i in obj)
            if (obj.hasOwnProperty(i))
                iterator(obj[i], i);

        return obj;
    },

    /**
     * Variable substitution on the string. It scans through the string looking for 
     * expressions enclosed in { } braces. If an expression is found, use it as a key on the object, 
     * and if the key has a string value or number value, it is substituted for the bracket expression 
     * and it repeats.
     * 
     * @param {String} tmpl Template for string replacement
     * @param {Object} o Template value holder
     * @returns {String} Replaced template with values from object
     */
    supplant: function (tmpl, o) {
        return tmpl.replace(
            /{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    },

    /**
     * Log custom text to console with timestamp prefix.
     * 
     * @param {...String} str
     */
    log: function (str) {
        var text = ('[' + ((new Date).toTimeString()).substr(0, 8) + ']').grey;

        this.forEach(arguments, function (value, key) {
            if (key % 2)
                text += (' ' + value).magenta;
            else
                text += (' ' + value).cyan;
        })

        console.log(text);

        return text;
    },

    /**
     * Recurse syncronous directory unlink
     * 
     * @param {String} pathToDir Path to folder to be deleted recurse
     */
    unlinkDir: function (pathToDir) {
        if (!pathToDir || pathToDir === '' || pathToDir === '/' || pathToDir === '\\')
            return;

        var self = this;
        if (fs.existsSync(pathToDir)) {
            fs.readdirSync(pathToDir)
                .forEach(function (file, index) {
                    var curPath = path.join(pathToDir, file);

                    if (fs.lstatSync(curPath).isDirectory()) // recurse
                        self.unlinkDir(curPath);
                    else // delete file
                        fs.unlinkSync(curPath)
                });

            fs.rmdirSync(pathToDir);
        }
    }

};

module.exports = crip;