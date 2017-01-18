/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const fs = require('fs');
const customPlumber = require('../utils/plumber');

gulp.task('templates', () => {
  gulp.src('app/views/pages/**/*.pug')
      .pipe(customPlumber('Error running templates'))
      .pipe($.pug({
        pretty: true,
        data: JSON.parse(fs.readFileSync('./app/data.json'))
      }))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
