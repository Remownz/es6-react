'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    plugins = require('gulp-load-plugins')(),
    bourbon = require('node-bourbon'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    path = require("path");

var pkg = require('./package.json');
var dirs = pkg['project-configs'].directories;
var config = pkg['project-configs'].config;

var sassIncludePath = bourbon.includePaths.concat([path.join(__dirname, dirs.libraries)]);

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = Object.keys(pkg['dependencies']);

// keep a count of the times a task refires
var scriptsCount = 0;

/*************************************************************************
 *  Helper Tasks
 *************************************************************************
 *
 *
 */

/**
 *  Delete the output directory
 */
gulp.task('clean', function (done) {
    return del([
        dirs.dist
    ], done);
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

gulp.task('build:prod', [
    'build:html',
    'build:sass:prod',
    'build:js:prod'
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
gulp.task('build:js', function () {
    bundleApp(false);
});

gulp.task('build:js:prod', function () {
    bundleApp(true);
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

gulp.task('connect', function () {
    connect.server({
        root: 'web',
        port: 3000,
        livereload: true
    });
});

/**
 *  default Task
 */

gulp.task('default', function (callback) {
    runSequence('clean',
        ['build', 'connect', 'watch'],
        callback)
});


// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
    scriptsCount++;
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var appBundler = browserify({
        entries: dirs.src + '/app.js',
        debug: true
    });

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1) {
        // create vendors.js for dev environment.
        browserify({
            require: dependencies,
            debug: true
        })
            .bundle()
            .on('error', gutil.log)
            .pipe(source('vendors.js'))
            .pipe(gulp.dest(dirs.dist + '/js'));
    }
    if (!isProduction) {
        // make the dependencies external so they dont get bundled by the
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function (dep) {
            appBundler.external(dep);
        })
    }

    appBundler
        // transform ES6 to ES5 with babelify
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(dirs.dist + '/js'));
}
