var crip = require('crip-core');
var events = require('events');
var utils = require('./Utils');


/**
 * Creates new instance of crip public method holder
 * 
 * @param {Object} gulp
 * @param {Config} config
 * @param {Object} task
 * @param {CripWeb} cripweb
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
        var taskDefinition = new taskConstructor(gulp, config, cripweb, task, utils);
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
        };
    };

    /**
     * Public method to include gulp tasks
     * 
     * @param {String|Array} task Task Name/Array of names to include in crip default command
     * @return {CripMethods}
     */
    this.addDefault = function (task) {
        if (crip.isArray(task))
            crip.forEach(task, function (val) {
                cripweb._beforeDefault.push(val);
            });
        else
            cripweb._beforeDefault.push(task);

        return this;
    };
}

/**
 * Extending EventEmitter prototype
 */
CripMethods.prototype.__proto__ = events.EventEmitter.prototype;



module.exports = CripMethods;