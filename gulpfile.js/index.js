/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const KarmaServer = require('karma').Server;
const requireDir = require('require-dir');

requireDir('./tasks');

gulp.task('watch', () => {
  gulp.watch('app/sass/**/*.scss', ['sass', 'lint:scss']);
  gulp.watch('app/js/**/*.js', ['lint:js']);
  gulp.watch('app/js/**/*.js', browserSync.reload());
  gulp.watch('app/*.html', browserSync.reload());
  gulp.watch([
    'app/templates/**/*',
    'app/pages/**/*.+(html|nunjucks)',
    'app/data.json',
  ], ['nunjucks']);
});

gulp.task('default', (cb) => {
  runSequence(
    'clear:dev',
    'sprites',
    ['lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['browserSync', 'watch'],
    cb
  );
});

gulp.task('test', (done) => {
  new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    singleRun: true,
  }, done).start();
});

gulp.task('build', cb =>
  runSequence(
    ['clear:dist', 'clear:dev'],
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['useref', 'images', 'fonts', 'test'],
    cb
  )
);
