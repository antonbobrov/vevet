const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {

    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        contentBase: baseWebpackConfig.externals.paths.public,
        port: 8081,
        overlay: {
            warnings: true,
            errors: true
        }
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]

});

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig);
});