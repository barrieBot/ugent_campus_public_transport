import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ["**/*.ts"],
    // Globale Einstellungen
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript-Regeln
      ...tsPlugin.configs.recommended.rules,
      
      // Eigene Regeln
      'semi': "off",
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
