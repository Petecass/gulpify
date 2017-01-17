/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserSync = require('browser-sync');

gulp.task('browserSync', () =>
  browserSync({
    server: {
      baseDir: 'app',
      notify: false
    }
  })
);
