function CssHelper(Crip) {
    return {
        processors: processors
    };

    function processors(includeCssnano) {
        var processors = [],
            conf = Crip.Config.get('css');

        // https://github.com/postcss/autoprefixer
        if (conf.autoprefix.enabled)
            processors.push(require('autoprefixer')(conf.autoprefix.options));

        // https://github.com/robwierzbowski/node-pixrem
        if (conf.pixrem.enabled)
            processors.push(require('pixrem')(conf.pixrem.options));

        // http://cssnano.co/
        if(includeCssnano)
            processors.push(require('cssnano')(conf.cssnano.options));

        return processors;
    }
}

module.exports = CssHelper;