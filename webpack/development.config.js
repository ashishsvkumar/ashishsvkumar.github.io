const merge = require('webpack-merge');
const commonConfig = require('./common.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');

module.exports = merge(commonConfig, {
    // optimization: {
    //     minimizer: [new UglifyJsPlugin()],
    // },
    // plugins: [
    //     new CompressionPlugin({
    //         compressionOptions: {
    //             numiterations: 15
    //         },
    //         algorithm(input, compressionOptions, callback) {
    //             return zopfli.gzip(input, compressionOptions, callback);
    //         }
    //     })
    // ]
});
