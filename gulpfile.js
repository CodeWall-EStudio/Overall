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
	src+'/js/index.js'	
];
var mangaejs = [
	src+'/js/constant/contant.js',
	src+'/js/server/importServer.js',
	src+'/js/server/quotaServer.js',
	src+'/js/server/utilServer.js',
	src+'/js/controller/navController.js',
	src+'/js/controller/toolbarController.js',
	src+'/js/controller/quotaController.js',
	src+'/js/controller/manageController.js',
	src+'/js/controller/msgController.js',
	src+'/js/manage.js'
];
var importjs = [
	src+'/js/constant/contant.js',
	src+'/js/server/importServer.js',
	src+'/js/server/quotaServer.js',
	src+'/js/server/utilServer.js',
	src+'/js/controller/navController.js',
	src+'/js/controller/toolbarController.js',
	src+'/js/controller/quotaController.js',
	src+'/js/controller/importController.js',
	src+'/js/controller/msgController.js',
	src+'/js/import.js'
];

gulp.task('concat',function(){
	gulp.src(jqlib)
		.pipe(concat('jslib.js'))
		.pipe(gulp.dest('./public/js/lib'));
	gulp.src(cssList)
		.pipe(concat('main.css'))
		.pipe(minifycss())
		.pipe(gulp.dest('./public/css/'));
	gulp.src(indexjs)
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
	gulp.src(mangaejs)
		.pipe(concat('manage.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
	gulp.src(importjs)
		.pipe(concat('import.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));	
	console.log('concat complite!')			;
});

gulp.task('build',function(){
	gulp.src('web/*.html')
		//.pipe(replace('%TimeStamp%',new Date().getTime()))
		.pipe(htmlreplace({    
		'maincss' : 'css/main.css?t='+new Date().getTime(),
		'managecss' : 'css/manage.css?t='+new Date().getTime(),
		'lib' : 'js/lib/jslib.js',
		'indexjs' : 'js/index.js?t='+new Date().getTime(),
		'managejs' : 'js/manage.js?t='+new Date().getTime(),
		'importjs' : 'js/import.js?t='+new Date().getTime()
	}))
	.pipe(gulp.dest('./public/')); 	
})

gulp.task('copy',function(){
	gulp.src('./web/css/imgs/**')
	.pipe(gulp.dest('./public/css/imgs'));
});

gulp.task('watch',function(){
});

gulp.task('default',['concat'],function(){
	console.log('gulp start');
});

gulp.task('dist',['concat','copy','build'],function(){
	console.log('gulp start');
});