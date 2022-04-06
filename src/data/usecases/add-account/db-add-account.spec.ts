
import { Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
export interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('Hashed_value')
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut, encrypterStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    await sut.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
