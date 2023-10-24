import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: 'test/integration',
  testRegex: '.*.spec.ts$',
  transform: {
    '^.+.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  verbose: true,
  reporters: [['default', { summaryThreshold: 1 }]],
}

export default config
