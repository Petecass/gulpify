/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');

gulp.task('fonts', () =>
  gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
);
