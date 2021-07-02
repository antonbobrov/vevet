/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { merge } = require('webpack-merge');
const { PATHS } = require('./paths');
const baseConfig = require('./webpack.prod.conf');

module.exports = merge(baseConfig, {

    entry: {
        index: path.join(PATHS.src.cdn, 'index.js'),
    },
    output: {
        filename: '[name].js',
        path: PATHS.build.cdn,
    },

});
