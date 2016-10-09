var crip = require('crip-core');
var events = require('events');

/**
 * Creates new instance of crip public method holder
 * 
 * @param {Config} config
 */
function CripMethods(gulp, config, task, cripweb) {
    var self = this;
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

        if (crip.isFunction(taskDefinition.configure)) {
            taskDefinition.configure();
        }

        this[name] = taskDefinition.fn;
        this[name].isInDefault = function () {
            if (crip.isFunction(taskDefinition.isInDefault))
                return taskDefinition.isInDefault(self.config);

            return true;
        }
    }

    /**
     * Public method to include gulp tasks
     * 
     * @param {any} taskName Name of the task to include in crip default command
     * @return {CripMethods}
     */
    this.addDefault = function (taskName) {
        cripweb._beforeDefault.push(taskName);

        return this;
    }
}

/**
 * Extending EventEmitter prototype
 */
CripMethods.prototype.__proto__ = events.EventEmitter.prototype;



module.exports = CripMethods;