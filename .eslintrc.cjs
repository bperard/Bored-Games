module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'eol-last': 'error',
    'eqeqeq': [
      'error',
      'always'
    ],
    'indent': [
      'error',
      2
    ],
    'new-cap': 'warn',
    'no-console': 'off',
    'no-multi-spaces': [
      'warn',
      {
        'exceptions': {
          'VariableDeclarator': true
        }
      }
    ],
    'no-redeclare': [
      'error',
      {
        'builtinGlobals': true
      }
    ],
    'no-template-curly-in-string': 'error',
    'no-trailing-spaces': 'warn',
    'no-undefined': 'off',
    'quotes': [
      'warn',
      'single',
      {
        'allowTemplateLiterals': true
      }
    ],
    'semi': 'error',
  },
}
