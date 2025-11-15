const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const transpileModules = [
    'linkedom',
    'htmlparser2',
    'domhandler',
    'domutils',
    'entities',
    'domelementtype'
];
const transpileModulePaths = transpileModules.map((moduleName) =>
    path.resolve(__dirname, 'node_modules', moduleName)
);

module.exports = (env = {}) => {
    const manifestVersion = env.mv === 'v3' ? 'v3' : 'v2';
    const isProd = !!env.production;
    const isDebugBuild = !!env.debug;
    const outputDir = path.resolve(__dirname, `dist-${manifestVersion}`);

    const copyPatterns = [
        { from: './src/contentScript', to: 'contentScript' },
        { from: './thirdParty', to: 'thirdParty' },
        { from: './src/images', to: 'images' },
        { from: './src/popup/popup.html' },
        { from: './src/searchResult/searchResult.html' },
        {
            from: `./src/manifest.${manifestVersion}.json`,
            to: 'manifest.json'
        },
        {
            from: './src/_locales',
            to: '_locales',
            transform: (content) => {
                const locales = {};
                content
                    .toString()
                    .split('\n')
                    .forEach((line) => {
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
    ];

    return {
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? false : 'source-map',
        entry: {
            background: './src/background/background.ts',
            popup: './src/popup/popupRoot.tsx',
            searchResult: './src/searchResult/searchResultRoot.tsx'
        },
        output: {
            filename: 'js/[name].js',
            path: outputDir,
            globalObject: 'self'
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.json', '.mjs'],
            alias: {
                canvas: path.resolve(__dirname, 'src/utils/canvasStub.js')
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.m?js$/,
                    include: transpileModulePaths,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            chrome: '88'
                                        }
                                    }
                                ]
                            ],
                            plugins: [
                                '@babel/plugin-proposal-optional-chaining',
                                '@babel/plugin-proposal-nullish-coalescing-operator'
                            ]
                        }
                    }
                }
            ]
        },
        optimization: {
            splitChunks: false,
            minimize: !isDebugBuild
        },
        plugins: [
            new webpack.DefinePlugin({
                IS_MANIFEST_V3: JSON.stringify(manifestVersion === 'v3'),
                DEBUG_BUILD: JSON.stringify(isDebugBuild),
                'process.env.MANIFEST_VERSION': JSON.stringify(manifestVersion)
            }),
            new CopyWebpackPlugin(copyPatterns)
        ],
        target: 'web'
    };
};
