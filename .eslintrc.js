module.exports = {
  env: {
    'browser': false,
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  extends: 'eslint:recommended',
  globals: {
    'exampleGlobalVariable': true
  },
  overrides: [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  parserOptions: {
    'ecmaVersion': 'latest'
  },
  rules: {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'quote-props': 0,
    'no-multiple-empty-lines': 2,
    'comma-spacing': [2, { 'before': false, 'after': true }]
  }
};
