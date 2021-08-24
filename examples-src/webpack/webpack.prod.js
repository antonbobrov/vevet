const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const baseProdConfig = require('../../config/webpack.prod.conf');

module.exports = merge(baseConfig, baseProdConfig, {

});
