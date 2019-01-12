/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Based on similar script in Jest
// https://github.com/facebook/jest/blob/a7acc5ae519613647ff2c253dd21933d6f94b47f/scripts/prettier.js

const chalk = require('chalk');
const glob = require('glob');
const prettier = require('prettier');
const fs = require('fs');
const prettierConfigPath = require.resolve('../.prettierrc');
let didError = false;

let files = [];

const ignoreFiles = [
  '**/node_modules/**',
  '**/**.snap',
  '**/dist/**',
  '**/**.map',
  '**/thirdParty/**',
];

const jsFiles = glob.sync('**/*.js*', {
  ignore: ignoreFiles,
});

files = files.concat(jsFiles);

if (!files.length) {
  return;
}

files.forEach(file => {
  const options = prettier.resolveConfig.sync(file, {
    config: prettierConfigPath,
  });
  const fileInfo = prettier.getFileInfo.sync(file);

  if (fileInfo.ignored) {
    return;
  }
  try {
    const input = fs.readFileSync(file, 'utf8');
    const withParserOptions = {
      ...options,
      parser: fileInfo.inferredParser,
    };
    const output = prettier.format(input, withParserOptions);

    if (output !== input) {
      fs.writeFileSync(file, output, 'utf8');
      console.log(chalk.cyanBright(`${file} is prettier`));
    }
  } catch (e) {
    didError = true;
  }
});

if (didError) {
  process.exit(1);
}

console.log(chalk.greenBright('prettier complete'));
