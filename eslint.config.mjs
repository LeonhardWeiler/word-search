import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';


export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        console: 'readonly',
        document: 'readonly',
        process: 'readonly',
        window: 'readonly'
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          impliedStrict: true
        }
      }
    },
    rules: {
      'indent': ['warn', 2, { 'SwitchCase': 1 }],
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'brace-style': ['warn', '1tbs'],
      'quotes': ['warn', 'single'],
      'semi': ['error', 'always'],
      'semi-style': ['error', 'last'],
      'semi-spacing': ['warn', { 'before': false, 'after': false }],
      'no-console': ['off'],
      'camelcase': ['warn', { 'properties': 'always' }],
      'react/prop-types': ['off'],
    },
    // ...other config
  },
];
