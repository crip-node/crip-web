var crip = require('./crip');

/**
 * Creates new instance of crip public method holder
 * 
 * @param {Config} config
 */
function CripMethods(gulp, config, task, cripweb) {
    this.config = config;

    /**
     * Define new public method 
     * 
     * @param {String} name
     * @param {Object} taskDefinition
     * @param {Callable} taskDefinition.fn
     */
    this.define = function (name, taskConstructor) {
        var taskDefinition = new taskConstructor(gulp, config, cripweb, task);
        if (this[name])
            throw new Error(crip.supplant('Crip already contains method with name "{method}"!', { method: name }));

        if (!taskDefinition.fn)
            throw new Error(crip.supplant('Crip cannot register "{method}" method without definition!', { method: name }));

        this[name] = taskDefinition.fn;

        if (taskDefinition.configure && crip.isFunction(taskDefinition.configure)) {
            taskDefinition.configure(this.config);
        }
    }
}

module.exports = CripMethods;