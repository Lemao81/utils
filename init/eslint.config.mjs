import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/', 'src/theme/eject/']),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },
    plugins: { '@stylistic': stylistic, '@typescript-eslint': tseslint.plugin },
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
        { blankLine: 'never', prev: 'import', next: 'import' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
])
