import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, this.secret)
  }
}
