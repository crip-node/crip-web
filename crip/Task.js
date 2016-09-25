var crip = require('./crip');

function Task(section, name, fn, globs) {
    this._fn = fn;
    
    this.globs = globs || false;
    this.section = section;
    this.name = name;
    this.id = crip.supplant('{section}-{name}', this);
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

        crip.log('Starting crip', id, '...');
        var currTime = new Date();
        return this._fn()
            .on('finish', function () {
                crip.log('Complete crip', id, 'after ' + (new Date() - currTime) + ' ms');
                taskStack[id]--;
            })
    }
}

module.exports = Task;