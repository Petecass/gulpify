/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.task('useref', () =>
  gulp.src('app/*.html')
      .pipe($.useref())
      .pipe($.cached('useref'))
      .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.js', $.rev()))
      .pipe($.if('*.css', $.purifycss(['./app/js/**/*.js', './app/*.html'])))
      .pipe($.if('*.css', $.cssnano()))
      .pipe($.if('*.css', $.rev()))
      .pipe($.revReplace())
      .pipe(gulp.dest('dist'))
);

