import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'
describe('DbAddAccount Usecase', () => {
  test('Should call with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await Promise.resolve('Hashed_value')
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    await sut.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
