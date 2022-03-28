
import { SignUpController } from './SignUp'
import { EmailValidator } from '../protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../errors/'

interface SutType{
  sut: SignUpController
  emailValidator: EmailValidator
}
const maketSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidator = new EmailValidatorStub()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    emailValidator
  }
}
describe('Signup controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',

        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no confirmPassword is provided', () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        password: 'any_password'
      }
    }
    const httpRespose = sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('confirmPassword'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidator } = maketSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'ivalid_email@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpRespose = sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call correct emailValidator with correct email', () => {
    const { sut, emailValidator } = maketSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any@example.com')
  })
  test('Should return error 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidator = new EmailValidatorStub()
    const sut = new SignUpController(emailValidator)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
