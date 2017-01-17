/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const customPlumber = require('../utils/plumber');
const $ = require('gulp-load-plugins')();
const config = require('../config').sass;

gulp.task('sass', () =>
  gulp.src(config.src)
      .pipe(customPlumber('Error compiling Sass'))
      .pipe($.sourcemaps.init())
      .pipe($.sass(config.options.sass))
      .pipe($.autoprefixer(config.options.autoPrefixer))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({
        stream: true
      }))
);
