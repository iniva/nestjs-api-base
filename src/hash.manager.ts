import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashManager {
  private readonly saltRounds: number

  constructor() {
    this.saltRounds = 10
  }

  async createHash(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, this.saltRounds)

    return hash
  }

  async equals(unhashedText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(unhashedText, hashedText)
  }
}
