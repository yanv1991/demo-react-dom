// next.config.js
// const withPlugins = require('next-compose-plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const withSass = require('@zeit/next-sass')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

let extractCssInitialized = false

module.exports = {
    target: 'serverless',
    webpack: (config, { isServer, dev }) => {
        const extraLoaders = isServer ? [] : [ExtractCssChunks.loader];
        config.module.rules.push(
            {
                    test: /\.(sass|scss)$/,
                    use: [
                        ...extraLoaders,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: dev,
                                importLoaders: 1,
                                onlyLocals: isServer
                            }
                        },
                        'sass-loader',
                    ],
                },
        );

        if (!isServer && !extractCssInitialized) {
            config.plugins.push(
                new ExtractCssChunks({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: dev
                    ? 'static/chunks/[name].css'
                    : 'static/chunks/[name].[contenthash:8].css',
                    chunkFilename: dev
                    ? 'static/chunks/[name].chunk.css'
                    : 'static/chunks/[name].[contenthash:8].chunk.css',
                    hot: dev
                })
                )
            extractCssInitialized = true
        }

        if (process.env.ANALYZE) {
            config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: isServer
                    ? '../analyze/server.html'
                    : './analyze/client.html',
            }),
        );
        }
        return config;
    },
}