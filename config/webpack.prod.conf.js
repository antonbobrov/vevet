/* eslint-disable import/no-extraneous-dependencies */

const { merge } = require('webpack-merge');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const preamble = require('./preamble');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {

    mode: 'production',

    optimization: {
        minimize: true,
        concatenateModules: true,
        minimizer: [
            (compiler) => {
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        parse: {},
                        compress: {
                            drop_console: false,
                            passes: 1,
                        },
                        format: {
                            beautify: false,
                            comments: false,
                            preamble,
                        },
                        mangle: true,
                        safari10: true,
                    },
                }).apply(compiler);
            },
        ],
        usedExports: true,
        sideEffects: false,
    },

    plugins: [
        new webpack.ProgressPlugin({ percentBy: 'entries' }),
        new CleanWebpackPlugin({
            verbose: false,
            cleanStaleWebpackAssets: true,
            dry: false,
        }),
    ],

});
