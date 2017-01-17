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

const supportedBrowsers = ['last 2 versions'];


function customPlumber(errTitle) {
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

gulp.task('clean:dev', () =>
  del.sync([
    'app/css',
    'app/*.html',
  ])
);

gulp.task('watch', () => {
  gulp.watch('app/sass/**/*.scss', [sass]);
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
    'clean:dev',
    'sprites',
    ['sass', 'nunjucks'],
    ['browserSync', 'watch'],
    cb
  );
});

gulp.task('dev-ci', (cb) => {
  runSequence(
    'clean:dev',
    'sprites',
    ['sass', 'nunjucks'],
    cb
  );
});

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:js', () => {
  gulp.src(['app/**/*.js', '!node_modules/**'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint({
        fix: true
      }))
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      .pipe(gulpIf(isFixed, gulp.dest('app/js')));
});

gulp.task('lint:scss', () => {
  gulp.src(['app/sass/**/*.scss', '!app/sass/**/_sprites.scss'])
      .pipe(sassLint({
        configFile: '.sass-lint.yml'
      }))
      .pipe(sassLint.format());
});

gulp.task('test', ['lint:scss', 'lint:js'], (done) => {
  new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    singleRun: true,
  }, done).start();
});
