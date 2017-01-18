/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const KarmaServer = require('karma').Server;

gulp.task('test', (done) => {
  new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    singleRun: true,
  }, done).start();
});
