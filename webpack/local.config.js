const merge = require('webpack-merge');
const commonConfig = require('./common.config.js');

module.exports = merge(commonConfig, {
    devtool: "source-map",

    devServer: {
        publicPath: '/',
        open: false,
        host: 'localhost',
        port: 8080,
        overlay: true,
        disableHostCheck: true,
        historyApiFallback: {
            rewrites: [
                { from: /\.css$/, to: '/rm-cs-bundle-[hash:6].css' },   // For nginx host page ("/customer-support/")
                { from: /\.js$/, to: '/rm-cs-bundle-[hash:6].js' },
                { from: /\/m\/(.*)/, to: '/support/m' },  // For all unknown path starting with "/m/", fallback to /m
                { from: /\/(.*)/, to: '/support' },  // For all unknown path starting with "/m/", fallback to /m
            ]
        }
    }
});
