import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  {
    files: ['**/*.vue', '**/*.js'],
    plugins: {
      vue: vuePlugin
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  }
];