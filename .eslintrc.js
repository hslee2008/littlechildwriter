module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {},
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript'
  ],
  plugins: [],
  rules: {
    'space-before-function-paren': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'arrow-parens': 'off',
    'no-console': 'off',
    curly: 'off',
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: false
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 10
        },
        multiline: {
          max: 1
        }
      }
    ]
  }
}
