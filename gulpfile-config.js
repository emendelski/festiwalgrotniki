var paths = {
    build: {
        js: 'build/js',
        css: 'build/scss',
        cssPages: 'build/scss/pages/**/*',
        images: 'build/images',
    },
    output: {
        root: '',
        js: 'assets/js',
        jsVendor: 'assets/js/vendor',
        css: 'assets/css',
        cssPages: 'assets/css/pages',
        cssVendor: 'assets/css/vendor',
        images: 'assets/images',
        fonts: 'assets/fonts'
    },
    npm: 'node_modules',
    main: 'build/js/functions.js'
};

exports.paths = paths;

exports.js = [
    paths.build.js + '/functions.js'
];

exports.copy = [
];