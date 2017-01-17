/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const gulpIf = require('gulp-if');
const customPlumber = require('../utils/plumber');

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:js', () => {
  gulp.src(['app/js/**/*.js'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(customPlumber('JS error'))
      .pipe(eslint({
        fix: true,
        useEslintrc: true
      }))
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      .pipe(gulpIf(isFixed, gulp.dest('app/js')))
      .pipe(eslint.failAfterError());
});

gulp.task('lint:scss', () => {
  gulp.src(['app/sass/**/*.scss', '!app/sass/**/_sprites.scss'])
      .pipe(sassLint({
        configFile: '.sass-lint.yml'
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
});
