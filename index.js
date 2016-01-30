var gulp = require('gulp'),
    fs = require('fs'),
    extend = require('extend'),
    Utils = require('./crip/Utils');

var Crip = function (callback) {
    require('require-dir')('./crip/tasks');

    callback(Crip.core);

    createGulpTasks.call(Crip);
};

Crip.core = {};
Crip.config = config = require('./crip/Config');
Crip.Task = require('./crip/Task')(Crip);
Crip.tasks = config.tasks;
Crip.extend = _extend;
Crip.setDefaultFrom = setDefaultFrom;

var createGulpTasks = function () {
    var sections = this.tasks;
    Utils.forEach(sections, function (section) {
        Utils.forEach(section, createGulpTask);
    });
};

function createGulpTask(task) {
    if (Utils.contains(gulp.tasks, task.id)) return;

    gulp.task(task.id, function () {
        var gulpTask = Crip.Task.find(task.section, task.name).run();

        // TODO: add section task, to run all inside tasks in one hit
        //Crip.config.activeTasks[task.id]++;

        return gulpTask;
    });
}

function setDefaultFrom(file) {
    var overrides;

    if (fs.existsSync(file)) {
        overrides = JSON.parse(fs.readFileSync(file, 'utf8'));

        extend(true, Crip.config, overrides);
    }
}

function _extend(name, callback) {
    Crip.core[name] = function () {
        callback.apply(this, arguments);

        return this.core;
    }.bind(this);
}

module.exports = Crip;