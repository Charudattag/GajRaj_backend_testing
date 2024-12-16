//eslint.config.js
import { default as eslintJs } from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';

const { configs: recommendedConfigs } = eslintJs;

export default [
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
        "prettier/prettier": [
      {
        singleQuote: true, // Allow single quotes
        semi: true,        // Enforce semicolons
      }
    ],
        'no-undef': 'off', // Ignore errors for process, require, module
        'no-unused-vars': 'warn', // Warn for unused variables
      },
    },
  ];
  