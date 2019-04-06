module.exports = {
  verbose: false,
  setupFiles: ['./scripts/setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    window: true,
    // 'ts-jest': {
    //   diagnostics: false,
    // },
  },
  rootDir: process.cwd(),
  testPathIgnorePatterns: ['/node_modules/', 'node'],
  transformIgnorePatterns: [
    '/dist/',
    '/thirdParty/',
    'node_modules/[^/]+?/(?!(es|node_modules)/)',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      './mock/fileMock.js',
    '\\.(css|scss|less)$': './mock/styleMock.js',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/scripts/**',
    '!**/thirdParty/**',
  ],
};
