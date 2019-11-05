const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default

const buildWebpackConfig = merge(baseWebpackConfig, {

    mode: 'production',

    optimization: {
        minimize: true,
        concatenateModules: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 5,
                    mangle: true,
                    output: {
                        beautify: true,
                        comments: false
                    }
                }
            })
        ],
        usedExports: true,
        sideEffects: true
    },

    plugins: [
        new ImageminPlugin({
            disable: false,
            pngquant: {
                quality: '95-100'
            }
        })
    ]

});

module.exports = new Promise((resolve) => {
    resolve(buildWebpackConfig);
});