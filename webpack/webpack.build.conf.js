/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const preamble = require('./preamble');
const baseWebpackConfig = require('./webpack.base.conf');

const buildWebpackConfig = merge(baseWebpackConfig, {

    mode: 'production',

    optimization: {
        minimize: true,
        concatenateModules: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: false,
                        keep_fargs: false,
                        passes: 1,
                    },
                    ecma: 5,
                    mangle: true,
                    output: {
                        beautify: false,
                        comments: false,
                        preamble,
                    },
                },
            }),
        ],
        usedExports: true,
        sideEffects: true,
    },

    plugins: [
        new CleanWebpackPlugin({
            verbose: false,
            cleanStaleWebpackAssets: true,
            dry: false,
        }),
    ],

});

module.exports = new Promise((resolve) => {
    resolve(buildWebpackConfig);
});
