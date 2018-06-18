const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


let commonWebpackSettings = {
    entry: {
        main: './src/index.js',
        vendor: [
            "react", "react-dom", 'react-virtualized'
        ]
    },

    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    test: "vendor",
                    name: "vendor",
                    enforce: true
                }
            }
        }
    },

    plugins: [
        // new CleanWebpackPlugin(['dist/'], {
        //     exclude: ['dist/index_template.html']
        // }),

        new HtmlWebpackPlugin({
            template: 'dist/index_template.html',
        }),

        new webpack.HashedModuleIdsPlugin(),
    ]
};


module.exports = commonWebpackSettings;