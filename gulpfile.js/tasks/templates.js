/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const customPlumber = require('../utils/plumber');

gulp.task('nunjucks', () => {
  gulp.src('app/pages/**/*.+(html|nunjucks)')
      .pipe(customPlumber('Error running Nunjucks'))
      .pipe(data(() => JSON.parse(fs.readFileSync('./app/data.json'))))
      .pipe(nunjucksRender({
        path: ['app/templates']
      }))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
