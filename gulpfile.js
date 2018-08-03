var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function () {
    return gulp.src('src/assets/less/employee-app.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function () {
    return gulp.src('dist/css/employee-app.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy JS to dist
gulp.task('js', function () {
    return gulp.src(['src/assets/js/employee-app.js'])
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

// Resource bundling with minification
gulp.task("bundle", function(){
    return gulp.src(['src/app/env.config.js', 'src/app/app.js', 'src/app/app.config.js',
    'src/app/app.module.js', 'src/app/app.routes.js',
    'src/app/controllers/get-employees.controllers.js',
    'src/app/controllers/add-employees.controllers.js',
    'src/app/controllers/update-employees.controllers.js',
    'src/app/services/employees-crud.services.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest("dist/js"))
        .pipe(browserify())
        .pipe(gulp.dest("dist/js"))
        .pipe(rename("bundle.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
})

// Minify JS
gulp.task('minify-js', ['js'], function () {
    return gulp.src('src/assets/js/employee-app.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('src/assets/vendor/bootstrap'))

    gulp.src(['node_modules/bootstrap-social/*.css', 'node_modules/bootstrap-social/*.less', 'node_modules/bootstrap-social/*.scss'])
        .pipe(gulp.dest('src/assets/vendor/bootstrap-social'))

    gulp.src(['node_modules/datatables/media/**/*'])
        .pipe(gulp.dest('src/assets/vendor/datatables'))

    gulp.src(['node_modules/datatables.net-bs/**/*'])
        .pipe(gulp.dest('src/assets/vendor/datatables.net-bs'))

    gulp.src(['node_modules/datatables-bootstrap3-plugin/media/**/*'])
        .pipe(gulp.dest('src/assets/vendor/datatables-bootstrap3-plugin'))

    gulp.src(['node_modules/datatables.net-responsive-bs/**/*'])
        .pipe(gulp.dest('src/assets/vendor/datatables.net-responsive-bs'))

    gulp.src(['node_modules/angular/*'])
        .pipe(gulp.dest('src/assets/vendor/angular'))

    gulp.src(['node_modules/angular-route/*'])
        .pipe(gulp.dest('src/assets/vendor/angular-route'))

    gulp.src(['node_modules/datatables-responsive/css/*', 'node_modules/datatables-responsive/js/*'])
        .pipe(gulp.dest('src/assets/vendor/datatables-responsive'))

    gulp.src(['node_modules/font-awesome/**/*', '!node_modules/font-awesome/*.json', '!node_modules/font-awesome/.*'])
        .pipe(gulp.dest('src/assets/vendor/font-awesome'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('src/assets/vendor/jquery'))
})

// Run everything
gulp.task('default', ['minify-css', 'minify-js', 'copy', 'bundle']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'js', 'minify-js', 'bundle'], function () {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('dist/css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch(['src/views/*.html', 'src/app/*.js', 'src/app/**/*.js', 'dist/js/*.js'], browserSync.reload);
});
