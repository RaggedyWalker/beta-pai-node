module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 使用prettier中的样式规则
    'plugin:prettier/recommended' // 启动eslint-plugin-prettier并且将prettier作为eslint的规则
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  globals: {
    exampleGlobalVariable: true
  },
  overrides: [
    {
      env: {
        es2021: true,
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'quote-props': 0,
    'no-multiple-empty-lines': 2,
    'comma-spacing': [2, { before: false, after: true }]
  }
};
