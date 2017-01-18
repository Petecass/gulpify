# Gulpify

[![Build Status](https://travis-ci.org/Petecass/gulpify.svg?branch=master)](https://travis-ci.org/Petecass/gulpify)

This is a starting point for building basic websites using Gulp as a task runner

`npm install` will install all dependencies as well as installing all of bowers dependencies.

`npm start` will compile assets and fire up a dev server. Now you're ready to start coding.

Once everything is finished you can `npm run build` to optimise everything and move it in to the `dist` folder. You can check everything is working by running `gulp server:dist` to view the optimised app on localhost.

For deployment there is a very basic script to deploy to Github pages. `npm run deploy` will push everything in the dist folder to a gh-pages branch.