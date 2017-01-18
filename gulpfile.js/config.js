const sourceDir = 'app';

const config = {
  sass: {
    src: `${sourceDir}/sass/**/*.scss`,
    dest: `${sourceDir}/css`,
    options: {
      sass: {
        includePaths: [
          `${sourceDir}/bower_components`,
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
