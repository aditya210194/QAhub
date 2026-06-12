// scripts/analyze-bundle.js
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('../config/webpack.config.js');

// Create a copy of the webpack config and add the analyzer plugin
const analyzeConfig = { ...config };
analyzeConfig.plugins = [...config.plugins, new BundleAnalyzerPlugin()];
analyzeConfig.mode = 'production';

// Run webpack
webpack(analyzeConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error('Build failed:', err || stats.toJson().errors);
        process.exit(1);
    }
    console.log('Build complete! Open http://localhost:8888 to view bundle analysis');
});