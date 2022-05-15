import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './authentication-protocols'

const makeFakeAccount = (): AccountModel => (
  { id: '123', name: 'test', email: 'any_email@mail.com', password: 'hashed_password' })

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository

  hashComparerStub: HashComparer

  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (_: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = (): AuthenticationModel => ({ email: 'any_email@mail.com', password: 'any_password' })
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (_: string, _1: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}
const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (_: string): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (_: string, _1: string): Promise<void> {
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub }
}

describe('db-authentication.ts', function () {
  test('should call LoadAccountByEmailRepository with correct email', async function () {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should throw if LoadAccountByEmailRepository throws', async function () {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockImplementationOnce(async () => await Promise.reject(new Error()))
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })
  test('should return null if  LoadAccountByEmailRepository returns null', async function () {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async function () {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should throw if HashComparer throws', async function () {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })
  test('should return null if  LoadAccountByEmailRepository returns false', async function () {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('should call TokenGenerator with correct id', async function () {
    const { sut, tokenGeneratorStub } = makeSut()
    const generatorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generatorSpy).toHaveBeenCalledWith('123')
  })
  test('should throw if TokenGenerator throws', async function () {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(async () => await Promise.reject(new Error()))
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })
  test('should return the token if success', async function () {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toEqual('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct token', async function () {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('123', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async function () {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockImplementationOnce(async () => await Promise.reject(new Error()))
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })
})
