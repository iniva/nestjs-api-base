import { Test, TestingModule } from '@nestjs/testing'
import { HashManager } from './hash.manager'

describe('HashManager', () => {
  let provider: HashManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashManager],
    }).compile()

    provider = module.get<HashManager>(HashManager)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  it('should create a hash from a text', async () => {
    const plainText = 'someString'
    const hash = await provider.createHash(plainText)

    expect(plainText).not.toEqual(hash)
  })

  it('should fail when a hash is different from the original text', async () => {
    const plainText = 'someString'
    const hash = await provider.createHash('anotherPlainText')
    const equals = await provider.equals(plainText, hash)

    expect(equals).toBeFalsy
  })

  it('should return true when a hash is equal to the original text', async () => {
    const plainText = 'someString'
    const hash = await provider.createHash(plainText)
    const equals = await provider.equals(plainText, hash)

    expect(equals).toBeTruthy
  })
})
