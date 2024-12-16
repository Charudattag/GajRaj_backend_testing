//eslint.config.cjs
/* eslint-disable no-undef */
const { configs: recommendedConfigs } = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');
/* eslint-enable no-undef */

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...recommendedConfigs.recommended.rules,
      'prettier/prettier': 'error',
      'prettier/prettier': ['error', { singleQuote: false }],
    },
  },
];
