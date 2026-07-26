import { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: 'test/integration',
  testRegex: 'features/.*.spec.ts$',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/../../tsconfig.int.json',
      diagnostics: { ignoreCodes: [151002] },
    }],
  },
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    // Redirect ESM bare specifiers to themselves for Jest's ESM resolver
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/../../src/$1',
    '^@Test/(.*)$': '<rootDir>/$1',
  },
  reporters: [['default', { summaryThreshold: 1 }]],
}

export default config
