var fs = require('fs');

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	minifycss = require('gulp-minify-css'),
	//replace = require('gulp-replace'),
	watch = require('gulp-watch'),
	htmlreplace = require('gulp-html-replace');

var src = './web';
var dist = './public';

var cssList = [
  src+"/css/bootstrap.min.css",
  src+"/css/main.css",
  src+"/css/messenger.css",
  src+"/css/messenger-spinner.css",
  src+"/css/messenger-theme-air.css",
  src+"/css/messenger-theme-block.css",
  src+"/css/messenger-theme-flat.css",
  src+"/css/messenger-theme-future.css",
  src+"/css/messenger-theme-ice.css"
];
var mcssList = [
  src+"/css/bootstrap.min.css",
  src+"/css/manage.css",
  src+"/css/messenger.css",
  src+"/css/messenger-spinner.css",
  src+"/css/messenger-theme-air.css",
  src+"/css/messenger-theme-block.css",
  src+"/css/messenger-theme-flat.css",
  src+"/css/messenger-theme-future.css"
  //src+"/css/messenger-theme-ice.css"
];
var jqlib = [
  src+'/js/lib/jquery/jquery-2.0.3.min.js',
  src+'/js/lib/angular/angular_1.2.6.js',
  src+'/js/lib/underscore/underscore.min.js',
  src+'/js/lib/bootstrap.min.js',
  src+'/js/lib/messenger.min.js'
];
var indexjs = [
	src+'/js/constant/contant.js',
	src+'/js/server/gradeServer.js',
	src+'/js/controller/gradeController.js',
	src+'/js/index.js',	
];

gulp.task('concat',function(){
	gulp.src(jqlib)
		.pipe(concat('jslib.js'))
		.pipe(gulp.dest('./public/js/lib'));
	
	console.log(cssList);
	gulp.src(cssList)
		.pipe(concat('main.css'))
		.pipe(minifycss())
		.pipe(gulp.dest('./public/css/'));

	gulp.src(indexjs)
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('watch',function(){
});

gulp.task('default',['concat'],function(){
	console.log('gulp start');
});
