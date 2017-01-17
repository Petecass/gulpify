/* eslint-disable comma-dangle */

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const autoPrefixer = require('gulp-autoprefixer');
const sourceMaps = require('gulp-sourcemaps');
const spriteSmith = require('gulp.spritesmith');
const gulpIf = require('gulp-if');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const del = require('del');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const KarmaServer = require('karma').Server;
const gutil = require('gulp-util');
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

const supportedBrowsers = ['last 2 versions'];


// Custom Plumber function for catching errors
function customPlumber(errTitle) {
  if (process.env.CI) {
    return plumber({
      errorHandler: (err) => {
        throw Error(gutil.colors.red(err.message));
      }
    });
  }
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || 'Error running Gulp',
      message: 'Error: <%= error.message %>'
    })
  });
}

gulp.task('sass', () =>
  gulp.src('app/sass/**/*.scss')
      .pipe(customPlumber('Error compiling Sass'))
      .pipe(sourceMaps.init())
      .pipe(sass({
        includePaths: ['app/bower_components'],
      }))
      .pipe(autoPrefixer({
        browsers: supportedBrowsers
      }))
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
        stream: true
      }))
);

gulp.task('browserSync', () =>
  browserSync({
    server: {
      baseDir: 'app',
      notify: false
    }
  })
);

gulp.task('nunjucks', () => {
  gulp.src('app/pages/**/*.+(html|nunjucks)')
      .pipe(customPlumber('Error running Nunjucks'))
      .pipe(data(() => JSON.parse(fs.readFileSync('./app/data.json'))))
      .pipe(nunjucksRender({
        path: ['app/templates']
      }))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('sprites', () =>
  gulp.src('app/images/sprites/**/*')
      .pipe(spriteSmith({
        cssName: '_sprites.scss',
        imgName: 'sprites.png',
        imgPath: '../images/sprites.png',
        retinaSrcFilter: 'app/images/sprites/*@2x.png',
        retinaImgName: 'sprites@2x.png',
        retinaImgPath: '../images/sprites@2x.png'
      }))
      .pipe(gulpIf('*.png', gulp.dest('app/images')))
      .pipe(gulpIf('*.scss', gulp.dest('app/sass')))
);

gulp.task('clear:dev', () =>
  del.sync([
    'app/css',
    'app/*.html',
  ])
);

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

gulp.task('dev-ci', (cb) => {
  runSequence(
    'clear:dev',
    'sprites',
    ['lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    cb
  );
});

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:js', () => {
  gulp.src(['app/js/**/*.js'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(customPlumber('JS error'))
      .pipe(eslint({
        fix: true,
        useEslintrc: true
      }))
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      .pipe(gulpIf(isFixed, gulp.dest('app/js')))
      .pipe(eslint.failAfterError());
});

gulp.task('lint:scss', () => {
  gulp.src(['app/sass/**/*.scss', '!app/sass/**/_sprites.scss'])
      .pipe(sassLint({
        configFile: '.sass-lint.yml'
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
});

gulp.task('test', (done) => {
  new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    singleRun: true,
  }, done).start();
});

// Optimization

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

gulp.task('clear:cache', cb => cache.clearAll(cb));

gulp.task('clear:dist', () => del.sync(['dist']));

gulp.task('build', cb =>
  runSequence(
    ['clear:dist', 'clear:dev'],
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['useref', 'images', 'fonts', 'test'],
    cb
  )
);

gulp.task('browserSync:dist', () =>
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
);
