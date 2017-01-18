/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const cache = require('gulp-cache');
const browserSync = require('browser-sync');
const del = require('del');

gulp.task('clear:cache', cb => cache.clearAll(cb));

gulp.task('clear:dist', () => del.sync(['dist']));

gulp.task('clear:dev', () =>
  del.sync([
    'app/css',
    'app/*.html',
  ])
);

gulp.task('server:dist', () =>
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
);
