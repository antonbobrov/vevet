/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {

    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
    },

    devServer: {
        contentBase: baseWebpackConfig.externals.paths.public,
        open: true,
        compress: true,
        disableHostCheck: true,
        port: 8080,
        // host: "0.0.0.0",
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
    resolve(devWebpackConfig);
});
