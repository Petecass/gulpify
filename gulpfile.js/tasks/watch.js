/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserSync = require('browser-sync');

gulp.task('watch', () => {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', ['lint:js']);
  gulp.watch('app/js/**/*.js', browserSync.reload());
  gulp.watch('app/*.html', browserSync.reload());
  gulp.watch([
    'app/views/**/**/*',
    'app/data.json',
  ], ['templates']);
});
