const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Polyfills za Node.js core moduli
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "assert": require.resolve("assert"),
        "buffer": require.resolve("buffer"),
        "crypto": require.resolve("crypto-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url"),
        "util": require.resolve("util"),
        "querystring": require.resolve("querystring-es3"),
        "zlib": require.resolve("browserify-zlib"),
        "process": require.resolve("process/browser.js"),
        "fs": false,
        "net": false,
        "tls": false,
      };

      // Dodaj alias za process
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "process/browser": require.resolve("process/browser.js"),
      };

      // Dodaj webpack plugin za globalne varijable
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
      ];

      // Ignoriši source-map loader greške za node_modules
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.enforce === 'pre' && rule.use && rule.use.includes && rule.use.includes('source-map-loader')) {
          return {
            ...rule,
            exclude: [
              ...(rule.exclude || []),
              /node_modules\/axios/,
              /node_modules\/follow-redirects/,
              /node_modules\/proxy-from-env/,
              /node_modules\/url/,
              /node_modules\/util/,
            ],
          };
        }
        return rule;
      });

      // Ignoriraj webpack greške za specifične module
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Cannot read properties of undefined \(reading 'module'\)/,
        /Can't resolve 'process\/browser'/,
      ];

      return webpackConfig;
    },
  },
};
