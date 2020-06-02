// next.config.js
const withPlugins = require('next-compose-plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactLoadableManifestGenerator = require('./plugins/reactLoadableManifestGenerator');
// const withSass = require('@zeit/next-sass')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

let extractCssInitialized = false

/**
 * Helper to encapsulate the fix for reactLoadable
 * json generated manifest read more on the
 * ./plugins/reactLoadableManifestGenerator
 * @param {Object} config - Build config
 */
function adjutReactLoadable(config) {
    // Removing nextjs ReactLoadablePlugin
    // in favor of ReactLoadableManifestGenerator
    let i = 0;
    for (const plugin of config.plugins) {
      if (plugin.constructor.name === 'ReactLoadablePlugin') {
        config.plugins.splice(i, 1);
      }
      i += 1;
    }
    // This is a modified version of ReactLoadablePlugin
    // to generate an optimized version of react-loadable-manifest.json
    // since the original has been growing unlimitedly increasing the size of
    // lambda function and preventing them to be deployed
    debugger;
    config.plugins.push(
      new ReactLoadableManifestGenerator({
        fileName: 'react-loadable-manifest.json',
        chunksName: /ssr-cpm/,
      })
    );
  }

module.exports = withPlugins([
  /*[withSass, {
    cssModules: true,
  }], */
], {
    target: 'serverless',
    webpack: (config, { isServer, dev }) => {
        const extraLoaders = isServer ? [] : [ExtractCssChunks.loader];
        config.module.rules.push(
            {
                    test: /\.(sass|scss|css)$/,
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

        // Overriding ReactLoadablePlugin behavior
        adjutReactLoadable(config);

        return config;
    },
})