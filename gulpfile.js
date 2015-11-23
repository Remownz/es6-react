'use strict';

var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')({
            rename: {
                'gulp-sass': 'sass' ,
                'gulp-sass-glob': 'sassGlob',
                'gulp-autoprefixer': 'prefix',
                'gulp-sourcemaps': 'sourcemaps',
                'gulp-jshint': 'jshint',
                'gulp-jscs': 'jscs',
                'gulp-concat': 'concat',
                'gulp-uglify': 'uglify',
                'gulp-header': 'header',
                'gulp-rename': 'rename',
                'gulp-size': 'size',
                'gulp-debug': 'debug',
                'gulp-bundle': 'bundle',
                'gulp-imagemin': 'imagemin',
                'gulp-minify-html': 'minifyHTML',
                'gulp-flatten': 'flatten',
                'gulp-util': 'gutil'
            }
    }),
    bourbon     = require('node-bourbon'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    del         = require('del'),
    wiredep     = require('wiredep').stream,
    runSequence = require('run-sequence');


var pkg = require('./package.json');
var dirs = pkg['project-configs'].directories;
var config = pkg['project-configs'].config;
var banner  = require('./banner.js');

/*************************************************************************
 *  Helper Tasks
 *************************************************************************
 *
 *  Definition von Hilfstasks
 */

/**
 *  Zusammenfassung aller Kopiertasks
 */
gulp.task('copy',[
    'copy:fonts',
    'copy:images'
]);

/**
 *  Löscht den Ausgabeordner
 */
gulp.task('clean', function(done) {
   return  del([
       dirs.dist
   ], done);
});

/**
 *  Kopiert alle Schritftarten aus dem vendor Verzeichnis und legt diese in
 *  dem ausgabe Ordner unter Fonts ab.
 */
gulp.task('copy:fonts', function() {
    return gulp.src(dirs.src + '/**/font*/*.{ttf,woff,woff2,eof,svg}')
        .pipe(plugins.flatten({ includeParents: 0} ))
        //.pipe(wiredep({
        //    //directory: './src/vendor'
        //    exclude: [ '/jquery/' ]
        //}))
        .pipe(gulp.dest(dirs.dist + '/fonts'));
});


/**
 *  Kopiert alles Bilder aus dem src in den Ziel Ordner und minimiert diese.
 */
gulp.task('copy:images', function() {
    return gulp.src(dirs.src + '/img/')
        .pipe(plugins.debug({title: config.debug.title }))
        .pipe(plugins.size())
        .pipe(plugins.imagemin())
        .pipe(plugins.size())
        .pipe(gulp.dest(dirs.dist + '/img/'));
});

/**
 *  Benutzt die jshint Bibliothekt.
 *  Jshint prüft den erstellten JS Code und gibt hinweise zur Optimierung
 *
 *  jshint.com
 */
gulp.task('lint:js', function () {
    return gulp.src(dirs.src + '/js/*.js')
        //.pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
        //.pipe(plugins.jshint.reporter('fail'));
});


/*************************************************************************
 *  Build Tasks
 *************************************************************************
 *
 *  Alle benötigten Buid Tasks
 */

/**
 * Zusammenfassung aller Build Tasks
 */
gulp.task('build', [
    'build:html',
    'build:sass',
    'build:js'
]);

/**
 * Kopiert alle HTML Files in den Ziel Ordner und minimiert diese
 */
gulp.task('build:html', function () {
     return gulp.src(dirs.src + '/**/*.html')
        .pipe(plugins.debug({title: config.debug.title }))
        .pipe(plugins.size())
        //.pipe(wiredep({
        //    //directory: './src/vendor'
        //    exclude: [ '/jquery/' ]
        //}))
        .pipe(plugins.minifyHTML())
        .pipe(gulp.dest(dirs.dist));

});

/**
 *  Fügt alle JS scripts zusammen, fügt einen Header ein, sowie
 *  wird das Js File in zwei Versionen ausgeliefert, einer Normalen und einer min.
 */
gulp.task('build:js', function() {
     browserify(dirs.src + '/js/app.js', {debug: true})
            .bundle()
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(plugins.header(banner, {pkg: pkg}))
            .pipe(plugins.debug({title: config.debug.title }))
            .pipe(plugins.size())
            .pipe(gulp.dest(dirs.dist + '/js/'))
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(plugins.uglify())
            .pipe(plugins.header(banner, {pkg: pkg}))
            .pipe(plugins.debug({title: config.debug.title }))
            .pipe(plugins.size())
            .pipe(gulp.dest(dirs.dist + '/js'));
});


/**
 *   Kompiliert das Sass File zu einer CSS Datei.
 *   Fügt alle Vendor SCSS deteien hinzu, erstellt eine Sourcemap
 *   sowie kümmert sich um die Vender-Prefixe
 *
 *   Es wird Standardmäßig die Mixinsammlung Bourbon hinzugefügt
 *   http://bourbon.io/
 */
gulp.task('build:sass', function() {
     gulp.src(dirs.src + '/scss/app.scss')
        .pipe(wiredep({directory: './src/vendor'}))
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
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(plugins.debug({title: config.debug.title }))
        .pipe(plugins.size())
        .pipe(gulp.dest(dirs.dist + '/css/'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sass({ outputStyle: 'compressed' }))
        .pipe(plugins.header(banner, {pkg: pkg}))
        .pipe(plugins.debug({title: config.debug.title }))
        .pipe(plugins.size())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.dist + '/css/'));
});

/**
 *  Beobachtet Deteiänderungen und führt einen ensprechenden Taks erneut aus.
 */
gulp.task('watch', function () {
    gulp.watch(dirs.src + '/js/**/*.js', ['lint:js', 'build:js']);
    gulp.watch(dirs.src + '/scss/**/*.scss', ['build:sass']);
    gulp.watch(dirs.src + '/**/*.html', ['build:html']);
    gulp.watch(dirs.src + '/img/**', ['copy:img']);
});


/**
 *  Überschreiben des Defaulttask
 *  Es werden nacheinader folgende Task ausgefürt,
 *  Clean, Copy, Build und watch
 */

gulp.task('default', function(callback) {
    runSequence('clean',
        ['copy','build','watch'],
        callback)
});