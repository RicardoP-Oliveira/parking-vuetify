/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'vuetify',
    './.eslintrc-auto-import.json',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 4], //de acordo com sua preferência
    'comma-spacing': ['error', { before: false, after: true }],
  },
}
