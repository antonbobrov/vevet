const webpack = require('webpack');

module.exports = {

    target: 'web',

    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    module: {
        rules: [

            // JavaScript
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },

            // TypeScript
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },

        ],
    },

    plugins: [
        new webpack.ProgressPlugin({ percentBy: 'entries' }),
    ],

};
