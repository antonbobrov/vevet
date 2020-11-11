/* eslint-disable import/no-extraneous-dependencies */

const NODE_ENV = process.env.NODE_ENV || 'development';
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const PAGES = fs.readdirSync(paths.pagesDir).filter((fileName) => fileName.endsWith('.html'));

module.exports = {

    entry: {
        index: `${paths.src}/ts/index.ts`,
    },
    output: {
        filename: NODE_ENV === 'development'
            ? `${paths.assets}/js/[name].js`
            : `${paths.assets}/js/[name].[contenthash].js`,
        path: paths.public,
        publicPath: '',
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development'
                ? `${paths.assets}/css/[name].css`
                : `${paths.assets}/css/[name].[hash].css`,
        }),
        ...PAGES.map((page) => new HtmlWebpackPlugin({
            template: `${paths.pagesDir}/${page}`,
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
    ],

};
