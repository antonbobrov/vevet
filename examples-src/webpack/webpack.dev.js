const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const { PATHS } = require('../../config/paths');

module.exports = merge(baseConfig, {

    mode: 'development',

    devtool: 'eval-source-map',

    watchOptions: {
        aggregateTimeout: 100,
    },

    devServer: {
        contentBase: PATHS.pages.build,
        open: false,
        compress: true,
        port: 8080,
        overlay: {
            warnings: true,
            errors: true,
        },
        hot: false,
        liveReload: true,
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
