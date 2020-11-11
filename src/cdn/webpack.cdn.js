/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('../../config/webpack.base.build');

const config = merge(baseConfig, {

    mode: 'production',

    entry: {
        index: path.join(__dirname, './index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../../dist/cdn'),
    },

});

module.exports = new Promise((resolve) => {
    resolve(config);
});
