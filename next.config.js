const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
    target: 'serverless',
    webpack: (config, { isServer }) => {
        const configOptions = config;
        configOptions.devtool = 'source-map';
        configOptions.output.sourceMapFilename = '[file].map';
        for (const plugin of configOptions.plugins) {
            if (plugin.constructor.name === 'TerserPlugin') {
                plugin.options.sourceMap = true
                break
            }
        }
        if (process.env.ANALYZE) {
            configOptions.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: isServer
                    ? '../analyze/server.html'
                    : './analyze/client.html',
            }),
        );
        }
        return configOptions;
    },
};