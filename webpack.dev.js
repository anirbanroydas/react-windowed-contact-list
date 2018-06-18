const merge = require('webpack-merge');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
// const Jarvis = require("webpack-jarvis");

const common = require('./webpack.common.js');


let devWebpackSettings = merge(common, {
    mode: 'development',
	devtool: 'inline-source-map',

    devServer: {
        contentBase: './dist',
        hot: true
    },

    plugins: [
        // new Jarvis(),
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})

module.exports = devWebpackSettings;
