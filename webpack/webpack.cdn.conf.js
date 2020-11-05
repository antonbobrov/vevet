/* eslint-disable import/no-extraneous-dependencies */

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./paths').PATHS;
const preamble = require('./preamble');

module.exports = {

    mode: 'production',

    entry: {
        index: `${paths.cdn.src}/index.ts`,
    },
    output: {
        filename: '[name].js',
        path: paths.cdn.public,
        publicPath: '/',
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'ts-loader'],
            },
        ],

    },

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
        }),
    ],

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

};
