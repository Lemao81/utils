import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import expo from 'eslint-plugin-expo'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['.expo/', 'android/', 'dist/', 'modules/*/android/']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },
    plugins: { '@stylistic': stylistic, '@typescript-eslint': tseslint.plugin, expo },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        {
          blankLine: 'always',
          prev: [
            'multiline-const',
            'multiline-let',
            'multiline-expression',
            'multiline-block-like',
          ],
          next: '*',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      'expo/no-dynamic-env-var': 'error',
      'expo/no-env-var-destructuring': 'error',
      'expo/use-dom-exports': 'error',
    },
  },
])
