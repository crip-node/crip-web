var crip = require('crip-core');
var events = require('events');

/**
 * Initialise new instance of Task
 * 
 * @param {String} section
 * @param {String} name
 * @param {Function} fn
 * @param {String|Array} globs
 * @param {Boolean?} includeInDefault
 */
function Task(section, name, fn, globs, includeInDefault, deps) {
    this._fn = fn;
    this._includeInDefault = includeInDefault || false;

    this.globs = globs || false;
    this.section = section;
    this.name = name;
    this.id = crip.supplant('{section}-{name}', this);
    this.deps = deps;

    // we need to ensure that deps is array to avoid repeated checks in other places
    // deps allows us tu build task tree in gulp style dependencies
    if (crip.isDefined(deps)) {
        if (crip.isString(deps))
            this.deps = new Array(deps);
        else {
            // if it is not an array, just ignore as nothing else will not work in this case
            if (!crip.isArray(deps))
                this.deps = undefined;
        }
    }
}

/**
 * Extending EventEmitter prototype
 */
Task.prototype.__proto__ = events.EventEmitter.prototype;

/**
 * Determines is the task included for gulp 'default' task
 * 
 * @returns {Boolean}
 */
Task.prototype.isInDefaults = function () {
    return !!this._includeInDefault;
};

/**
 * Execite task deffinition
 * 
 * @param {Object} taskStack Task stack to determine is task already exequting
 * @returns
 */
Task.prototype.run = function (taskStack) {
    var self = this;
    var id = this.id;

    if (typeof taskStack[id] === 'undefined')
        taskStack[id] = 0;

    if (taskStack[id] == 0) {
        taskStack[id]++;

        var idStr = '\'' + id + '\'';
        crip.log('Starting CRIP', idStr, '...');
        var currTime = new Date();
        return this._fn()
            .on('finish', function () {
                var timeMetric = 'ms';
                var time = (new Date() - currTime);

                if (time > 999) {
                    time = (time / 1000).toFixed(2);
                    timeMetric = 's';
                }

                crip.log('Finished CRIP', idStr, 'after', time, timeMetric);
                taskStack[id]--;
                self.emit('finish', id);
            });
    }
};

module.exports = Task;