'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    plugins = require('gulp-load-plugins')(),
    bourbon = require('node-bourbon'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babel = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    gutil = require('gulp-util'),
    assign = require('lodash.assign'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    path = require("path"),
    envify = require('loose-envify/custom');

var pkg = require('./package.json');
var dirs = pkg['project-configs'].directories;
var config = assign({},
    pkg['project-configs'].config, {
        js: {
            entries: dirs.src + '/app.js',
            extensions: [' ', '.js', '.jsx'],
            //cache: {},
            //packageCache: {},
            plugin: [watchify]
        }
    }
);

var sassIncludePath = bourbon.includePaths.concat([path.join(__dirname, dirs.libraries)]);

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = Object.keys(pkg['dependencies']);



/*************************************************************************
 *  Build Tasks
 *************************************************************************
 *
 * all needed build tasks
 */

gulp.task('build', [
    'bundle',
    'build:sass:prod'
]);



/**
 *  Bundle all JS Files into a single one. Add a Header to the files
 *  also minify the output js.
 */
gulp.task('bundle:dev', function () {
    var args = assign(config.js, watchify.args, {debug: true}); // Merge in default watchify args with browserify arguments

    var bundler = browserify(args) // Browserify
        .plugin(watchify, {ignoreWatch: ['**/node_modules/**']}); // Watchify to watch source file changes

    bundleApp(bundler, false); // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function () {
        bundleApp(bundler, false); // Re-run bundle on source updates
    });
});

gulp.task('bundle', function () {
    var bundler = browserify(config.js);

    bundleApp(bundler, true);
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

gulp.task('watch', function()
{
    var watcher = gulp.watch(dirs.src + '/**/*.*');
    watcher.on('change', function(event)
    {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    gulp.watch(dirs.src + '/scss/**/*.s+(a|c)ss', ['build:sass:dev']);
});


/**
 *  default Task
 */

// Gulp task for build
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: "./web"
        }
    });
});

gulp.task('default', [
    'browser-sync',
    'bundle:dev',
    'watch'
]);


// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(appBundler, isProduction) {
    console.log('Production bundle: ' + isProduction);

    if (isProduction) {
        process.env.NODE_ENV = 'production';
    }

    appBundler
        // transform ES6 to ES5 with babelify
        .transform(babel.configure({
            presets: ['es2015', 'react']
        }))
        .transform(envify({
            global: true,
            _: 'purge',
            NODE_ENV: !isProduction ? 'development' : 'production'
        }))
        .bundle()
        .on('log', gutil.log)
        .on('error', function (err) {
            console.log(err.message);
            browserSync.notify(err.message, 3000);
            this.emit('end');
        })

        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({ compress: false}))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.dist + '/js'))
        .pipe(browserSync.stream({once: true}));
}
