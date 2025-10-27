module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  plugins: ['vue'],
  rules: {
    // カスタムルール
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off'
  }
}