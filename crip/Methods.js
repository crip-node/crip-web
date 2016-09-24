var Utils = require('./Utils');

/**
 * Creates new instance of crip public method holder
 * 
 * @param {Config} config
 */
function CripMethods(config) {
    this.config = config;
}

/**
 * Define new public method 
 * 
 * @param {String} name
 * @param {Object} taskDefinition
 * @param {Callable} taskDefinition.fn
 */
CripMethods.prototype.define = function (name, taskDefinition) {
    if (this[name])
        throw new Error(Utils.supplant('Crip already contains method with name "{method}"!', { method: name }));

    if (!taskDefinition.fn)
        throw new Error(Utils.supplant('Crip cannot register "{method}" method without definition!', { method: name }));

    this[name] = taskDefinition.fn;
}

module.exports = CripMethods;