'use strict';
const gulp = require('gulp'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),//自动添加css前缀
    concat = require('gulp-concat'),//合并文件
    cssmin = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js代码校验
    uglify = require('gulp-uglify'),//js压缩，混淆
    rename = require('gulp-rename');

// Styles任务
gulp.task('css', function () {
    //编译sass
    return gulp.src('public/dev/css/*.scss')
        .pipe(sass())
        //添加前缀
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //合并文件
        .pipe(concat('style.min.css'))
        //压缩样式文件
        .pipe(cssmin())
        //输出压缩文件到指定目录
        .pipe(gulp.dest('public/release/css/'))
        //提醒任务完成
        .pipe(notify({message: 'css task complete!'}));
});

gulp.task('js', function() {
    //js代码校验
    return gulp.src('public/dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //js代码合并
        .pipe(concat('main.js'))
        //给文件添加.min后缀
        .pipe(rename({ suffix: '.min' }))
        //压缩脚本文件
        .pipe(uglify())
        //输出压缩文件到指定目录
        .pipe(gulp.dest('public/release/js/'))
        //提醒任务完成
        .pipe(notify({ message: 'js task complete!' }));
});
gulp.task('watch-css', function() {
    // Watch .scss files
    gulp.watch('public/dev/css/*.scss', ['css']);
});
gulp.task('watch-js', function() {
    // Watch .js files
    gulp.watch('public/dev/js/*.js', ['js']);
});