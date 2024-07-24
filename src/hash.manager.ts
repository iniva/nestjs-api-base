import { pbkdf2Sync } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HashManager {
  private salt: string
  private iterations: number
  private keyLength = 64
  private digest = 'sha512'

  constructor(private readonly _configService: ConfigService) {
    this.salt = this._configService.getOrThrow<string>('app.hash.salt')
    this.iterations = this._configService.get<number>('app.hash.iterations')
  }

  createHash(text: string): string {
    const hash = pbkdf2Sync(text, this.salt, this.iterations, this.keyLength, this.digest).toString('hex')

    return hash
  }

  equals(unhashedText: string, hashedText: string): boolean {
    const hash = this.createHash(unhashedText)

    return hash === hashedText
  }
}
