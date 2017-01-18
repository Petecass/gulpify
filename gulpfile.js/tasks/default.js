/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('default', (cb) => {
  runSequence(
    'clear:dev',
    'sprites',
    'lint:js',
    ['sass', 'templates'],
    ['browserSync', 'watch'],
    cb
  );
});
