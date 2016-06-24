'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    bourbon = require('node-bourbon'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['project-configs'].directories;
var config = pkg['project-configs'].config;

var sassIncludePath = bourbon.includePaths.concat([path.join(__dirname, dirs.libraries)]);
/*************************************************************************
 *  Helper Tasks
 *************************************************************************
 *
 *
 */

/**
 *  All Copy tasks
 */
gulp.task('copy', [
    'copy:fonts',
    'copy:images'
]);

/**
 *  Delete the output directory
 */
gulp.task('clean', function (done) {
    return del([
        dirs.dist
    ], done);
});

/**
 *  Copy all fonts from vendor libraries.
 *  Fonts will be placed in the output directory
 */
gulp.task('copy:fonts', function () {
    return gulp.src(dirs.src + '/**/font*/*.{ttf,woff,woff2,eof,svg}')
        .pipe(plugins.flatten({includeParents: 0}))
        .pipe(gulp.dest(dirs.dist + '/fonts'));
});

/**
 *  Copy all images
 */
gulp.task('copy:images', function () {
    return gulp.src(dirs.src + '/img/')
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(gulp.dest(dirs.dist + '/img/'));
});

/*************************************************************************
 *  Build Tasks
 *************************************************************************
 *
 * all needed build tasks
 */

/**
 * all  build tasks
 */
gulp.task('build', [
    'build:html',
    'build:sass:dev',
    'build:js'
]);

/**
 * copy all html files
 */
gulp.task('build:html', function () {
    return gulp.src(dirs.src + '/**/*.html')
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(gulp.dest(dirs.dist));
});

/**
 *  Bundle all JS Files into a single one. Add a Header to the files
 *  also minify the output js.
 */
gulp.task('build:js', function() {
    var b = browserify(dirs.src + '/js/app.js', {
        debug: true
    });

    return b.bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({compress: false}))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest(dirs.dist + '/js'));
});


/**
 *   Compile all Sass into a single css file.
 *   add Vendorprefixes and create a Sourcemap

 *   it uses bourbon mixins by default
 *   http://bourbon.io/
 */
gulp.task('build:sass:dev', function () {
    var src = dirs.src + '/scss/**/*.s+(a|c)ss';
    var dest = dirs.dist + '/css/';

    return gulp.src(src)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sassGlob())
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.changed(dest, {
            hasChanged: plugins.changed.compareSha1Digest,
            extension: '.css'
        }))
        .pipe(plugins.sass({
            includePaths: sassIncludePath,
            outputStyle: 'expanded'
        }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer([
            'last 2 version'
        ], {
            cascade: true
        }))
        .pipe(plugins.cssbeautify())
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(dest));
});

gulp.task('build:sass:prod', function () {
    var src = dirs.src + '/scss/**/*.s+(a|c)ss';
    var dest = dirs.dist + '/css/';

    return gulp.src(src)
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass({
            includePaths: sassIncludePath,
            outputStyle: 'compressed'
        }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer([
            'last 2 version'
        ], {
            cascade: true
        }))
        .pipe(gulp.dest(dest));
});

/**
 * Watch all changes
 */
gulp.task('watch', function () {
    //livereload.listen();
    gulp.watch(dirs.src + '/js/**/*.js', ['build:js']);
    gulp.watch(dirs.src + '/scss/**/*.s+(a|c)ss', ['build:sass:dev']);
    gulp.watch(dirs.src + '/**/*.html', ['build:html']);
    gulp.watch(dirs.src + '/img/**', ['copy:img']);
});

/**
 * Inline css
 */

gulp.task('inline:css', function () {
    var src = dirs.dist + '/**/*.html';
    var dest = dirs.dist + '/inline';


    return gulp.src(src)
        .pipe(plugins.inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(plugins.rename({suffix: '.inline'}))
        .pipe(gulp.dest(dest));
});

/**
 *  default Task
 */

gulp.task('default', function (callback) {
    runSequence('clean',
        ['copy', 'build', 'watch'],
        callback)
});
