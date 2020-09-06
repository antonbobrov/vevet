'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
// const fs = require('fs')
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    tests: path.join(__dirname, '../tests'),
    public: path.join(__dirname, '../public'),
    assets: 'assets/'
};

// const PAGES_DIR = `${PATHS.tests}/pug/pages`;
// const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {

    externals: {
        paths: PATHS
    },
    
    entry: {
        app: PATHS.tests + '/js/index.js'
    }, 
    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.public,
        publicPath: '/'
    },

    module: {

        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { modules: false }]
                    ]
                }
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.(png|jpg|gif|svg)?$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: NODE_ENV == 'development'
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: NODE_ENV == 'development',
                            config: {
                                path: PATHS.tests + '/styles/postcss.config.js'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: NODE_ENV == 'development'
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: NODE_ENV == 'development',
                            config: {
                                path: PATHS.tests + '/styles/postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: NODE_ENV == 'development',
                            "includePaths": [
                                require('path').resolve(__dirname, 'node_modules')
                            ]
                        }
                    }
                ]
            }
        ]

    },

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),
        // ...PAGES.map(page => new HtmlWebpackPlugin({
        //     template: `${PAGES_DIR}/${page}`,
        //     filename: `./${page.replace(/\.pug/,'.html')}`
        // })),
        new CopyWebpackPlugin([
            { from: `${PATHS.tests}/img`, to: `${PATHS.assets}img` },
            { from: `${PATHS.tests}/audio`, to: `${PATHS.assets}audio` },
            { from: `${PATHS.tests}/fonts`, to: `${PATHS.assets}fonts` },
            { from: `${PATHS.tests}/static`, to: '' },
            { from: `${PATHS.src}/scss`, to: `${PATHS.dist}/scss` },
        ])
    ],

};