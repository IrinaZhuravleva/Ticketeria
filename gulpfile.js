var gulp = require('gulp');
var browserSync = require('browser-sync').create();
// var less = require('gulp-less');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var htmlbeautify = require('gulp-html-beautify');

// Images
var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');

// HTML, CSS, JS
var usemin = require('gulp-usemin');
var htmlclean = require('gulp-htmlclean');
var uglify = require("gulp-uglify"); // Сжатие JS
var minifyCss = require("gulp-minify-css"); // Сжатие CSS
var rev = require('gulp-rev');

gulp.task('server', function() {
	
	browserSync.init({
		server: { baseDir: './build/'}
	});

	watch('./src/pug/**/*.*', function(){
		gulp.start('pug');
	});

	watch('./src/sass/**/*.scss', function(){
		gulp.start('styles');
	});

	watch('./src/js/**/*.js', function(){
		gulp.start('copy:js');
	});

	watch('./src/libs/**/*.*', function(){
		gulp.start('copy:libs-local');
	});

	watch('./src/fonts/**/*.*', function(){
		gulp.start('copy:fonts');
	});

	watch(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg'], function(){
		gulp.start('copy:img');
	});
});

gulp.task('server:docs', function() {
	browserSync.init({
		server: { baseDir: './docs/'}
	});
});


// gulp.task('sass', function() {
//     return gulp.src('./app/sass/**/*.scss')
//     .pipe(sass())
//     .pipe(gulp.dest('./app/css'))
//     .pipe(browserSync.stream());
// });


gulp.task('styles', function() {
	return gulp.src('./src/sass/main.scss')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'Styles',
				sound: false,
				message: err.message
			}
		})
	}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 6 versions'],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
});




gulp.task('pug', function() {
	// return gulp.src('./src/pug/pages/**/*.pug')
	return gulp.src('./src/pug/**/*.pug')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'Pug',
				sound: false,
				message: err.message
			}
		})
	}))
	.pipe(pug())
	.pipe(htmlbeautify(htmlbeautifyOptions))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.stream());
});

var htmlbeautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true,
	"preserve_newlines": false,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
};


gulp.task('copy:libs-local', function(callback) {
	gulp.src('./src/libs/**/*.*')
		.pipe(gulp.dest('./build/libs/'))
	callback()
});

gulp.task('copy:fonts', function(callback) {
	gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts/'))
	callback()
});


gulp.task('copy:img', function() {
	return gulp.src(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg'])
		.pipe(gulp.dest('./build/img'))
		.pipe(browserSync.stream());
});

gulp.task('copy:js', function() {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

gulp.task('clean:build', function() {
    return del('./build');
});

gulp.task('copy:build:files', function(callback) {
    gulp.src('./src/php/**/*.*')
        .pipe(gulp.dest('./build/php/'))
    gulp.src('./src/files/**/*.*')
        .pipe(gulp.dest('./build/files/'))
	gulp.src('./src/fonts/**/*.*')
	        .pipe(gulp.dest('./build/fonts/'))
	callback()
});

gulp.task('default', function(){
    runSequence(
    	'clean:build',
    	['styles', 'pug', 'copy:libs-local', 'copy:img', 'copy:js', 'copy:fonts'],
    	'server'
    )
});