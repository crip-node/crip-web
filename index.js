var CripWeb = require('./crip/CripWeb');

var Index = function (gulp, config) {

    var cripWeb = new CripWeb(gulp, config);

    return function (devBuilder) {
        devBuilder(cripWeb.getPublicMethods());

        cripWeb.defineRegisteredTasksInGulp();

        cripWeb.defineDefaultTasksInGulp();
    }
}

module.exports = Index;