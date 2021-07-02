/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('../../config/webpack.prod.conf');

module.exports = merge(baseConfig, {

    entry: {
        index: path.join(__dirname, 'index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../../', 'lib/cdn'),
    },

});
