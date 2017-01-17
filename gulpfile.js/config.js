
const config = {
  sass: {
    src: 'app/sass/**/*.scss',
    dest: 'app/css',
    options: {
      sass: {
        includePaths: [
          'app/bower_components',
          'node_modules',
        ],
      },
      autoPrefixer: {
        browsers: ['last 2 versions'],
      },
    },
  },
};

module.exports = config;
