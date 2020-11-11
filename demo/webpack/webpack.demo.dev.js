/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const demoConfig = require('./base');
const baseConfig = require('../../config/webpack.base');

const config = merge(baseConfig, demoConfig, {

    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
    },

    devServer: {
        contentBase: path.join(__dirname, '../public'),
        open: true,
        compress: true,
        disableHostCheck: true,
        port: 8080,
        overlay: {
            warnings: true,
            errors: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
    ],

});

module.exports = new Promise((resolve) => {
    resolve(config);
});
