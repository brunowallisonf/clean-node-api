import { Hasher } from '../../../data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'
export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, valueEncrypted: string): Promise<boolean> {
    return await bcrypt.compare(value, valueEncrypted)
  }
}
