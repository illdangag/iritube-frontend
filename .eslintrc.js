module.exports = {
  'ignorePatterns': ['node_modules/*', '**/.eslintrc.js', '**/next.config.js'],
  'env': {
    'browser': true,
    'node': true,
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': 'tsconfig.json',
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  'plugins': [
    '@typescript-eslint',
    'react',
  ],
  'rules': {
    '@typescript-eslint/indent': ['error', 2, {
      'ObjectExpression': 1,
      'SwitchCase': 1,
    },],
    'indent': ['error', 2, {
      'ObjectExpression': 1,
      'SwitchCase': 1,
    },],
    'semi': ['error', 'always',],
    'no-extra-semi': 'error',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', {
      'arrays': 'always',
      'exports': 'always',
      'functions': 'always-multiline',
      'imports': 'always',
      'objects': 'always',
      'enums': 'always',
    },],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'asyncArrow': 'always',
      'named': 'always',
    },],
    'no-trailing-spaces': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      },
    ],
    'arrow-spacing': ['error', {
      'before': true,
      'after': true,
    },],
    'space-infix-ops': ['error', {
      'int32Hint': false,
    },],
    'object-curly-spacing': ['error', 'always',],
    'quotes': ['error', 'single',],
    'jsx-quotes': ['error', 'prefer-single',],
    'react/jsx-tag-spacing': ['error', {
      'closingSlash': 'never',
      'beforeSelfClosing': 'never',
      'afterOpening': 'never',
      'beforeClosing': 'never',
    },],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-curly-spacing': ['error', { 'when': 'never', 'children': true }],
    'react/jsx-props-no-multi-spaces': ['error',],
    'no-console': ['warn', { 'allow': ['warn', 'error',], },],
    'eol-last': ['error', 'always',],
  },
};
