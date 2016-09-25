var crip = require('./crip');

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
        throw new Error(crip.supplant('Crip already contains method with name "{method}"!', { method: name }));

    if (!taskDefinition.fn)
        throw new Error(crip.supplant('Crip cannot register "{method}" method without definition!', { method: name }));

    this[name] = taskDefinition.fn;
}

module.exports = CripMethods;