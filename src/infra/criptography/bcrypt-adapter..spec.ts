/* eslint-disable @typescript-eslint/no-misused-promises */
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
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
  test('should call bcrypt with correct value', async () => {
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
  test('should throw an exception if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => { return await Promise.reject(new Error()) })
    const enc = sut.hash('any_value')
    await expect(enc).rejects.toThrow(new Error())
  })
})
