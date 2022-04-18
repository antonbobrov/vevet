const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { PATHS } = require('../paths');
const baseConfig = require('./webpack.base.conf');

const preamble = require('../preamble');

module.exports = merge(baseConfig, {

    mode: 'production',

    entry: {
        index: path.join(PATHS.src.cdn, 'index.js'),
    },
    output: {
        filename: '[name].js',
        path: PATHS.build.cdn,
    },

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
        new CleanWebpackPlugin({
            verbose: false,
            cleanStaleWebpackAssets: true,
            dry: false,
        }),
    ],
});
