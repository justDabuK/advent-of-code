module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
