/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const rsync = require('rsyncwrapper');
const ghPages = require('gulp-gh-pages');


if (!process.env.CI) {
  gulp.task('rsync', (cb) => {
    rsync({
      src: 'dist/',
      dest: 'synced-folder',
      recursive: true,
      deleteAll: true,
    }, cb);
  });

  gulp.task('deploy', ['build'], () =>
    gulp.src('dist/**/*')
        .pipe(ghPages())
  );
}
