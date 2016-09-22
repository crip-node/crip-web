var Crip = require('./crip/Crip');

var Index = function (gulp, config) {

    var crip = new Crip(gulp, config);

    return function (devBuilder) {
        devBuilder(crip.getPublicMethods());

        crip.defineRegisteredTasksInGulp();

        crip.defineDefaultTasksInGulp();
    }
}

module.exports = Index;