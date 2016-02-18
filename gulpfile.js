'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-sass': 'sass',
            'gulp-sass-glob': 'sassGlob',
            'gulp-autoprefixer': 'prefix',
            'gulp-sourcemaps': 'sourcemaps',
            'gulp-jshint': 'jshint',
            'gulp-jscs': 'jscs',
            'gulp-concat': 'concat',
            'gulp-uglify': 'uglify',
            'gulp-rename': 'rename',
            'gulp-size': 'size',
            'gulp-bundle': 'bundle',
            'gulp-flatten': 'flatten',
            'gulp-util': 'gutil',
            'gulp-livereload': 'livereload',
            'gulp-changed': 'changed'
        }
    }),
    bourbon = require('node-bourbon'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    runSequence = require('run-sequence'),
    sassLint = require('gulp-sass-lint');


var pkg = require('./package.json');
var dirs = pkg['project-configs'].directories;
var config = pkg['project-configs'].config;


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

/**
 *  It uses the JSlint library
 *  jshint.com
 */
gulp.task('lint:js', function () {
    return gulp.src(dirs.src + '/js/*.js')
        //.pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
    //.pipe(plugins.jshint.reporter('fail'));
});

/**
 * Lint sass
 */
gulp.task('lint:sass', function () {
    gulp.src(dirs.src + 'sass/**/*.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
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
    'build:sass',
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
gulp.task('build:js', function () {
    browserify(dirs.src + '/js/app.js', {debug: true})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.dist + '/js'))
        .pipe(livereload());
});


/**
 *   Compile all Sass into a single css file.
 *   add Ventorprifixes and create a Sourcemap

 *   it uses bourbon mixins by default
 *   http://bourbon.io/
 */
gulp.task('build:sass', function () {
    var SRC = dirs.src + '/scss/*.s+(a|c)ss';
    var DEST = dirs.dist + '/css/';

    return gulp.src(SRC)
        .pipe(plugins.changed(DEST, {extension: '.css'}))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass({
            includePaths: bourbon.includePaths
        }))
        .pipe(plugins.prefix([
            'last 3 versions',
            '> 1%',
            'ie >= 7'
        ], {
            cascade: true
        }))
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(gulp.dest(DEST))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sass({outputStyle: 'compressed'}))
        .pipe(plugins.debug({title: config.debug.title}))
        .pipe(plugins.size())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(DEST));
    //.pipe(livereload());
});

/**
 * Watch all changes
 */
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(dirs.src + '/js/**/*.js', ['lint:js', 'build:js']);
    gulp.watch(dirs.src + '/scss/**/*.s+(a|c)ss', ['lint:sass', 'build:sass']);
    gulp.watch(dirs.src + '/**/*.html', ['build:html']);
    gulp.watch(dirs.src + '/img/**', ['copy:img']);
});


/**
 *  default Task
 */

gulp.task('default', function (callback) {
    runSequence('clean',
        ['copy', 'build', 'watch'],
        callback)
});
