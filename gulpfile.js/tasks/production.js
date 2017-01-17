/* eslint-disable comma-dangle, import/no-extraneous-dependencies */

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
// const debug = require('gulp-debug');
const cached = require('gulp-cached');
const purify = require('gulp-purifycss');
const minifyCSS = require('gulp-cssnano');
const minifyImages = require('gulp-imagemin');
const cache = require('gulp-cache');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');

gulp.task('useref', () =>
  gulp.src('app/*.html')
      .pipe(useref())
      .pipe(cached('useref'))
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulpIf('*.css', purify(['./app/js/**/*.js', './app/*.html'])))
      .pipe(gulpIf('*.css', minifyCSS()))
      .pipe(gulpIf('*.js', rev()))
      .pipe(gulpIf('*.css', rev()))
      .pipe(revReplace())
      .pipe(gulp.dest('dist'))
);

gulp.task('images', () =>
  gulp.src('./app/images/**/*.+(png|jpg|jpeg|gif|svg)')
      .pipe(cache(minifyImages({
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

gulp.task('fonts', () =>
  gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
);
