const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const base = {
    entry: {
        background: './src/background/background.ts',
        popup: './src/popup/popupRoot.tsx',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './thirdParty', to: 'thirdParty' },
            { from: './src/manifest.json' },
            { from: './src/images', to: 'images' },
            { from: './src/popup/popup.html' },
            { from: './src/_locales', to: '_locales',
                transform: (content) => {
                    const locales = {};
                    content.toString().split('\n').forEach(line => {
                        const matchResult = line.match(/(\w+): (.*)/);
                        if (!matchResult) {
                            return;
                        }
                        const key = matchResult[1];
                        const message = matchResult[2];
                        locales[key] = {
                            message
                        };
                    });
                    return JSON.stringify(locales);
                },
                transformPath: (targetPath) => {
                    return targetPath.replace(/\/(\w+)\.yml$/, (_, locale) => {
                        return `/${locale}/messages.json`;
                    });
                }
            }
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.mjs']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ]
    },
    target: 'web'
};

module.exports = (env) => {
    env = env || {};
    const isProd = env.production;
    base.mode = isProd ? 'production' : 'development';
    if (!isProd) {
        base.devtool = 'source-map';
    }
    return base;
};