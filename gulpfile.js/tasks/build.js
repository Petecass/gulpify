/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', cb =>
  runSequence(
    ['clear:dist', 'clear:dev'],
    ['sprites', 'lint:js'],
    ['sass', 'templates'],
    ['useref', 'images', 'fonts', 'test'],
    cb
  )
);
