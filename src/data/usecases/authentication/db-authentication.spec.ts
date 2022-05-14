import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('db-authentication.ts', function () {
  test('should call LoadAccountByEmailRepository with correct email', async function () {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (_: string): Promise<AccountModel> {
        return { id: '123', name: 'test', email: 'any_email@mail.com', password: 'password' }
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
