const path = require('path');
const webpack = require('webpack');
const AssetsWebpackPlugin = require('assets-webpack-plugin');

const dllConfig = (conf)=>{
    return {
        mode: 'production',
        name: conf.name,
        dependencies: conf.ref ? [conf.ref.name]: [],
        entry: {
            [conf.name]: conf.libs
        },
        output: {
            path: path.resolve(__dirname, '../public/dll'),
            filename: `[name].${conf.version}.min.js`,
            library: `[name]_${conf.version}`
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, '../public/dll', `[name].${conf.version}.manifest.json`),
                name: `[name]_${conf.version}`
            }),
            // 生成一个bundle-config.json保存着dll.vondor.[hash].js的值
            new AssetsWebpackPlugin({
                path: path.join(__dirname, '../public/dll'),
                filename: 'bundle-config.json',
                update: true
            })
        ],
        performance: {
            hints: 'warning',
            maxEntrypointSize: 50000000,
            maxAssetSize: 30000000,
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }
};
module.exports = dllConfig;

