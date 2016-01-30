var Utils = require('./Utils');

var Crip;

var Task = function (section, name, description) {
    this.section = section;
    this.name = name;
    this.id = section + '-' + name;

    if (description) {
        this.describe(description);
    }
};

Task.find = function (section, name) {
    var taskSection = Crip.tasks[section],
        tasks = Utils.where(taskSection, {name: name});

    return tasks[Crip.config.activeTasks[section + '-' + name]];
};

Task.prototype = {
    describe: describe,
    register: register
};

function describe(definition) {
    this.definition = definition;

    this.register();

    return this;
}

function register() {
    if (!Crip.tasks.hasOwnProperty(this.section))
        Crip.tasks[this.section] = [];

    Crip.tasks[this.section].push(this);

    Crip.config.activeTasks = Crip.config.activeTasks || {};
    Crip.config.activeTasks[this.id] = 0;

    return this;
}

function run() {
    return this.definition();
}

module.exports = function (crip) {
    // Make Crip available throughout this file.
    Crip = crip;

    return Task;
};