import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const sourceFiles = ['*.{ts,tsx,js,jsx,mjs,cjs}', 'src/**/*.{ts,tsx,js,jsx}', 'tests/**/*.{ts,tsx,js,jsx}'];
const tsFiles = ['*.ts', '*.tsx', 'src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'];

const projectFile = path
  .join(__dirname, 'tsconfig.eslint.json')
  .replace(/\\/g, '/');
const tsconfigRootDir = path.dirname(projectFile);

const tsTypeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: tsFiles,
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: [projectFile],
      tsconfigRootDir,
      projectService: true,
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...(config.languageOptions?.globals ?? {}),
    },
  },
}));

export default [
  {
    ignores: ['.next/**/*', 'node_modules/**/*', 'coverage/**/*', 'eslint.config.mjs', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals').map((config) => ({
    ...config,
    files: sourceFiles,
  })),
  ...tsTypeCheckedConfigs,
  {
    files: sourceFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslintPluginPrettierRecommended,
];


