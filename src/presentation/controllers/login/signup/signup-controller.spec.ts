
import { SignUpController } from './signup-controller'
import { Authentication, AuthenticationModel, EmailValidator, HttpRequest, Validation } from './signup-protocols'
import { MissingParamError } from '../../../errors'
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { serverError, badRequest, ok, forbidden } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors/email-in-use-error'
const makeAuthenticatorStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'token'
    }
  }
  return new AuthenticationStub()
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password'
  }
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}
interface SutType{
  sut: SignUpController
  emailValidator: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}
const makeSut = (): SutType => {
  const emailValidator = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticatorStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    emailValidator,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const accountFake = makeFakeAccount()
      return await Promise.resolve(accountFake)
    }
  }
  return new AddAccountStub()
}
describe('Signup controller', () => {
  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@example.com',
      password: 'any_password'
    })
  })

  test('Should return error 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => reject(new Error('Error'))) })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new Error('Error')))
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    const okResult = ok({ accessToken: 'token' })
    expect(httpResponse).toEqual(okResult)
  })

  test('Should return 403 addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValue(null)
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    const okResult = forbidden(new EmailInUseError())
    expect(httpResponse).toEqual(okResult)
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validatorSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400  validation returns an', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('Should call authentication  with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@example.com', password: 'any_password' })
  })
  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
