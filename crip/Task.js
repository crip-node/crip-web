var Utils = require('./Utils');

function Task(section, name, fn, globs) {
    this._fn = fn;
    
    this.globs = globs || false;
    this.section = section;
    this.name = name;
    this.id = Utils.supplant('{section}-{name}', this);
}

Task.prototype.isWatch = function () {
    return this.section == 'watch';
}

Task.prototype.run = function (taskStack) {
    var id = this.id;
    if (typeof (taskStack[id]) === 'undefined')
        taskStack[id] = 0;

    if (taskStack[id] == 0) {
        taskStack[id]++;

        Utils.log('Starting crip ', id, '...');
        var currTime = new Date();
        return this._fn()
            .on('finish', function () {
                Utils.log('Completed crip', id, 'after' + (new Date() - curr) + ' ms');
                taskStack[id]--;
            })
    }
}

module.exports = Task;