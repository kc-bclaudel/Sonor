module.exports = {
  env: {
    browser: true,
    es2020: true,
    "jest": true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "linebreak-style": 0,
    "react/prop-types": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "no-use-before-define": 0,
    "react/jsx-props-no-spreading": 0,
    "react/no-did-update-set-state": 0,

  },
};
