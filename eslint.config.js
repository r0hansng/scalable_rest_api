import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    plugins: { js },

    extends: ['js/recommended'],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2021,
      sourceType: 'module',
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
      'arrow-parens': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'object-curly-spacing': ['error', 'always'],
    },
  },
]);
