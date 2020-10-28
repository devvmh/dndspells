module.exports = {
  extends: 'airbnb',
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'immutable',
    'react',
  ],
  rules: {
    'immutable/no-mutation': 2,
    'jsx-a11y/label-has-associated-control': 0,
    'react/destructuring-assignment': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
  },
}
