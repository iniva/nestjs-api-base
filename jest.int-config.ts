import { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: 'test/integration',
  testRegex: '.*.spec.ts$',
  transform: {
    '^.+.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../src/$1',
    '^@Test/(.*)$': '<rootDir>/../../test/integration/$1',
  },
  reporters: [['default', { summaryThreshold: 1 }]],
}

export default config
