var Utils = require('./Utils');

function CripMethods(config) {
    this.config = config;
}

CripMethods.prototype.define = function (name, taskDefinition) {
    if (this[name])
        throw new Error(Utils.supplant('Crip already contains method with name "{method}"!', { method: name }));

    this[name] = taskDefinition.fn;
}

module.exports = CripMethods;