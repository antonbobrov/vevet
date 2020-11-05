/* eslint-disable import/no-extraneous-dependencies */

const NODE_ENV = process.env.NODE_ENV || 'development';

const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { PATHS } = require('./paths');

const PAGES_DIR = `${PATHS.demo.src}/html`;
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.html'));

module.exports = {

    externals: {
        paths: PATHS,
    },

    entry: {
        app: `${PATHS.demo.src}/ts/index.ts`,
    },
    output: {
        filename: NODE_ENV === 'development'
            ? `${PATHS.demo.assets}js/[name].js`
            : `${PATHS.demo.assets}js/[name].[contenthash].js`,
        path: PATHS.demo.public,
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
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                            config: {
                                path: `${PATHS.demo.src}/styles/postcss.config.js`,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                            config: {
                                path: `${PATHS.demo.src}/styles/postcss.config.js`,
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                            sassOptions: {
                                includePaths: [
                                    require('path').resolve(__dirname, 'node_modules'),
                                ],
                            },
                        },
                    },
                ],
            },
        ],

    },

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
        }),
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development'
                ? `${PATHS.demo.assets}css/[name].css`
                : `${PATHS.demo.assets}css/[name].[hash].css`,
        }),
        ...PAGES.map((page) => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
            },
        })),
        // new CopyWebpackPlugin([
        //     // { from: `${PATHS.demo.src}/folder`, to: `${PATHS.demo.assets}folder` },
        // ]),
    ],

};
