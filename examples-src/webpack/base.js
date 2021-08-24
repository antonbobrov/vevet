const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { PATHS } = require('../../config/paths');
const getPagesPaths = require('../compiler/getPagesPaths');
const baseConfig = require('../../config/webpack.base.conf');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PAGES = getPagesPaths();

module.exports = merge(baseConfig, {

    entry: {
        index: `${PATHS.pages.ts}/index.ts`,
    },
    output: {
        filename: NODE_ENV === 'development'
            ? 'assets/js/[name].js'
            : 'assets/js/[name].[contenthash].js',
        path: PATHS.pages.build,
        publicPath: '/',
    },

    module: {
        rules: [

            // CSS & SASS
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, 'postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, 'node_modules'),
                                ],
                            },
                        },
                    },
                ],
            },

        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development'
                ? 'assets/css/[name].css'
                : 'assets/css/[name].[hash].css',
        }),
        ...PAGES.map((page) => new HtmlWebpackPlugin({
            template: page.html,
            filename: `${page.filename}.html`,
            minify: false,
            inject: 'body',
        })),
        new CopyPlugin({
            patterns: [
                {
                    from: PATHS.pages.static,
                    to: '',
                },
            ],
        }),
    ],

});
