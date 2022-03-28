import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './SignUp'

const maketSut = (): SignUpController => {
  return new SignUpController()
}
describe('Signup controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = maketSut()
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
    const sut = maketSut()
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
    const sut = maketSut()
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
    const sut = maketSut()
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
})
