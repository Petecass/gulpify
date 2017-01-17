const gutil = require('gulp-util');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');


// Custom Plumber function for catching errors
function customPlumber(errTitle) {
  if (process.env.CI) {
    return plumber({
      errorHandler: (err) => {
        throw Error(gutil.colors.red(err.message));
      },
    });
  }
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || 'Error running Gulp',
      message: 'Error: <%= error.message %>',
    }),
  });
}

module.exports = customPlumber;
