// next.config.js
const withPlugins = require('next-compose-plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const withSass = require('@zeit/next-sass')

module.exports = withPlugins([
  /*[withSass, {
    cssModules: true,
  }], */
], {
    target: 'serverless',
    webpack: (config, { isServer }) => {
        config.devtool = 'source-map';
        config.output.sourceMapFilename = '[file].map';
        for (const plugin of config.plugins) {
            if (plugin.constructor.name === 'TerserPlugin') {
                plugin.options.sourceMap = true
                break
            }
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
});