const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./base');

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
