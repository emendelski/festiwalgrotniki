// Include gulp
var gulp = require('gulp');
var config = require('./gulpfile-config.js');
var $ = require('gulp-load-plugins')({
    pattern: ['exists-sync', 'del', 'browser-sync', 'gulp-*', 'jshint-*', 'imagemin-*', 'run-sequence']
});

function returnOnlyExistingFiles(filesArray){
    var existingFiles = [];

    for (var i = 0; i < filesArray.length; i++) {
        if ($.existsSync(filesArray[i])) {
            existingFiles.push(filesArray[i]);
        } else {
            console.log("File: " + filesArray[i] + " - doesn't exist. Check path or filename.");
        }
    }

    return existingFiles;
}

function initWatch(){
    gulp.watch(config.paths.build.css + '/**/*.scss', ['sass']);
    gulp.watch(config.paths.build.js + '/**/*.js', ['scripts']);
    gulp.watch(config.paths.build.images + '/**/*', ['images']);

    gulp.watch("./*.html").on('change', $.browserSync.reload);
}

/*
 * BROWSER SYNC
 * static Server + watching less/html files
 */
gulp.task('serve', ['sass'], function() {
    $.browserSync.init({
        server: "./__views/",
        serveStatic: ["./"],
        directory: true
    });

    initWatch();
});

/*
 * OUTPUT ERRORS
 * custom function to display errors
 */
function showError(error) {
    console.info(error.fileName + ': ' + error.lineNumber);
    console.error(error.message);

    var args = Array.prototype.slice.call(arguments);
    $.notify.onError("Error: <%= error.message %>").apply(this, args);
    this.emit('end');
}

/*
 * SASS
 * combines all SASS files, autoprefixes them, creates sourcemaps and outputs
 *
 * @dependecies
 * "gulp-sass"
 * "gulp-autoprefixer"
 */
var sassOptions = {
    errLogToConsole: false,
    outputStyle: 'expanded',
    includePaths: [config.paths.npm]
};

gulp.task('sass', function() {
    return gulp.src([
            config.paths.build.css + '/style.scss'
        ])
        .pipe($.sourcemaps.init())
            .pipe($.sass(sassOptions).on('error', showError))
            .pipe($.autoprefixer())
            .pipe($.cssnano({ discardComments: { removeAll: false } })).on('error', showError)
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.output.css))
        .pipe($.browserSync.stream())
        .pipe($.notify({ message: 'SASS compiled, prefixed and minified', onLast: true }));
});

/*
 * JSHINT
 * fetches main JS files and tries to JSHINT it.
 */
gulp.task('jshint', function() {
    return gulp.src(config.paths.main)
        .pipe($.jshint())
        .pipe($.jshint.reporter($.jshintStylish));
});

/*
 * COPY FILES
 * copy some custom files
 */
gulp.task('copy-latest-js', function () {
    var conf = require('./gulpfile-config.js');
    var existingFiles = returnOnlyExistingFiles(conf.copy);
    var dest = config.paths.output.jsVendor;

    return gulp.src(existingFiles)
        .pipe($.changed(dest))
        .pipe(gulp.dest(dest));
});

/*
 * JS SCRIPTS
 * fetch, combine & output minified all js files
 */
gulp.task('scripts', ['jshint'], function() {
    var conf = require('./gulpfile-config.js');
    var existingFiles = returnOnlyExistingFiles(conf.js);

    return gulp.src(existingFiles)
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(config.paths.output.js))
        .pipe($.uglify().on('error', showError))
        .pipe($.rename('app.min.js'))
        .pipe(gulp.dest(config.paths.output.js))
        .pipe($.browserSync.stream())
        .pipe($.notify('Scripts compiled and minified -> app.js'));
});

/*
 * IMAGES
 * fetch, compress & output all images to assets directory
 */
gulp.task('images', function() {
    return gulp.src(config.paths.build.images + '/**/*')
        .pipe($.changed(config.paths.output.images))
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [$.imageminPngquant()]
        }).on('error', showError))
        .pipe(gulp.dest(config.paths.output.images))
        .pipe($.browserSync.stream());
});

gulp.task('removeImages', function() {
    return gulp.src(config.paths.output.images + '/**/*', { read: false })
        .pipe($.rimraf({ force: true }));
});

gulp.task('imgs', function(callback){
  $.runSequence('removeImages', ['images'], callback);
});

/*
 * WATCH & DEFAULT
 */
gulp.task('watch', initWatch);

gulp.task('default', function (callback) {
    $.runSequence('imgs', ['sass', 'copy-latest-js', 'scripts', 'serve'], callback);
});