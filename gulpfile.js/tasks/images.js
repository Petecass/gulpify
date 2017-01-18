/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.task('images', () =>
  gulp.src('./app/images/**/*.+(png|jpg|jpeg|gif|svg)')
      .pipe($.cache($.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevels: 5,
        multipass: true,
        SVGOPlugins: [
          { removeTitle: true, },
          { removeUselessStrokeAndFill: false }
        ]
      })))
      .pipe(gulp.dest('dist/images'))
);
