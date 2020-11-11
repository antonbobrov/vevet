/* eslint-disable import/no-extraneous-dependencies */

const { merge } = require('webpack-merge');
const demoConfig = require('./base');
const baseConfig = require('../../config/webpack.base.build');

const config = merge(baseConfig, demoConfig, {

});

module.exports = new Promise((resolve) => {
    resolve(config);
});
