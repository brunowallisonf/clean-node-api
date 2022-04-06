
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
export interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
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
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (value: AddAccountModel): Promise<AccountModel> {
      return { id: 'valid_id', ...value }
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut, encrypterStub, addAccountRepositoryStub
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
  test('Should call add account repository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({ name: 'valid_name', email: 'valid_email', password: 'Hashed_value' })
  })
  test('Should throw if addAccount reporitory throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account if onsucces', async () => {
    const { sut } = makeSut()

    const accountData = { name: 'valid_name', email: 'valid_email', password: 'Hashed_password' }
    const result = await sut.add(accountData)
    expect(result).toEqual({ id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'Hashed_password' })
  })
})
