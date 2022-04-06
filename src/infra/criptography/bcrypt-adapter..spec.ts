import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  }
}))

describe('Bcrypt adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
