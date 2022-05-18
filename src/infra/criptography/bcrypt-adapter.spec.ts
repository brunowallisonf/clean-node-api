/* eslint-disable @typescript-eslint/no-misused-promises */
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))
interface SutTypes{
  sut: BcryptAdapter
  salt: number
}
const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    salt, sut
  }
}

describe('Bcrypt adapter', () => {
  test('should call hash with correct value', async () => {
    const { sut, salt } = makeSut()

    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })
  test('should throw an exception if hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => { return await Promise.reject(new Error()) })
    const enc = sut.hash('any_value')
    await expect(enc).rejects.toThrow(new Error())
  })
  test('should call compare with correct values', async () => {
    const { sut } = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'encrypted_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', 'encrypted_value')
  })
  test('should return true when compare returns true', async () => {
    const { sut } = makeSut()
    const comparison = await sut.compare('any_value', 'encrypted_value')
    expect(comparison).toBe(true)
  })
  test('should return false when compare returns false', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<Boolean> => false)
    const comparison = await sut.compare('any_value', 'encrypted_value')
    expect(comparison).toBe(false)
  })
  test('should throw false when compare throws ', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<Boolean> => { throw new Error() })
    const promise = sut.compare('any_value', 'encrypted_value')
    expect(promise).rejects.toThrow()
  })
})
