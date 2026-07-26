// @ts-check
import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  // ...tsEslint.configs.recommendedTypeChecked, // uncomment for type safety
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    // '@typescript-eslint/no-floating-promises': 'error' // needs type safety configs enabled (above)
    }
  },
  // ─── Hexagonal Architecture boundary rules ───────────────────────────────
  {
    plugins: { boundaries },
    settings: {
      // Disable legacy-pattern detection since we use the v7 entity selector syntax
      'boundaries/legacy-warnings': false,
      'boundaries/elements': [
        // Shared cross-cutting concerns (no feature dependencies)
        { type: 'shared',         pattern: 'src/shared/**/*' },
        // Configs (no feature dependencies)
        { type: 'configs',        pattern: 'src/configs/**/*' },
        // Feature layers — ordered from innermost to outermost
        { type: 'domain',         pattern: 'src/features/*/domain/**/*' },
        { type: 'application',    pattern: 'src/features/*/application/**/*' },
        { type: 'infrastructure', pattern: 'src/features/*/infrastructure/**/*' },
        { type: 'presenter',      pattern: 'src/features/*/presenter/**/*' },
        // Feature module root (wiring only)
        { type: 'module',         pattern: 'src/features/*/*module*' },
      ],
      'boundaries/ignore': ['**/*.spec.ts'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // shared: may only depend on shared and configs
            {
              from: { element: { type: 'shared' } },
              allow: [{ to: { element: { type: 'shared' } } }, { to: { element: { type: 'configs' } } }],
            },
            // configs: may only depend on shared
            {
              from: { element: { type: 'configs' } },
              allow: [{ to: { element: { type: 'shared' } } }],
            },
            // domain: zero internal dependencies
            {
              from: { element: { type: 'domain' } },
              allow: [],
            },
            // application: depends on domain and shared
            {
              from: { element: { type: 'application' } },
              allow: [{ to: { element: { type: 'domain' } } }, { to: { element: { type: 'shared' } } }],
            },
            // infrastructure: depends on domain, application (ports) and shared
            {
              from: { element: { type: 'infrastructure' } },
              allow: [
                { to: { element: { type: 'domain' } } },
                { to: { element: { type: 'application' } } },
                { to: { element: { type: 'shared' } } },
              ],
            },
            // presenter: depends on application and shared only
            {
              from: { element: { type: 'presenter' } },
              allow: [{ to: { element: { type: 'application' } } }, { to: { element: { type: 'shared' } } }],
            },
            // module wiring: may import all layers to wire DI
            {
              from: { element: { type: 'module' } },
              allow: [
                { to: { element: { type: 'domain' } } },
                { to: { element: { type: 'application' } } },
                { to: { element: { type: 'infrastructure' } } },
                { to: { element: { type: 'presenter' } } },
                { to: { element: { type: 'shared' } } },
              ],
            },
          ],
        },
      ],
    },
  },
)
