module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "cgps",
    "plugin:vue/strongly-recommended"
  ],
  // add your custom rules here
  rules: {},
  settings: {
    "import/resolver": {
      nuxt: {},
    },
  }
}
