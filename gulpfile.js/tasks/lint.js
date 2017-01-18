/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const gulpIf = require('gulp-if');
const customPlumber = require('../utils/plumber');

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:js', () => {
  gulp.src(['app/js/**/*.js'])
      .pipe(customPlumber('JS error'))
      .pipe(eslint({
        fix: true,
        useEslintrc: true
      }))
      .pipe(eslint.format())
      .pipe(gulpIf(isFixed, gulp.dest('app/js')))
      .pipe(eslint.failAfterError());
});
