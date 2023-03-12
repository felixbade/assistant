const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = (env) => {
    return {
        entry: './src/index.js',
        output: {
            filename: 'main-[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: false, // do not remove type="text"
                },
                version: env.version,
            }),
            new MiniCssExtractPlugin({
                filename: 'style-[contenthash].css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/static', to: '' },
                ],
            }),
            new GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: [{
                    // match everything
                    urlPattern: /$/,

                    // return a cached response immediately
                    // but always update the content in the background
                    handler: 'StaleWhileRevalidate',
                }],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
    }
};