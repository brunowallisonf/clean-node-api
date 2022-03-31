
import { SignUpController } from './SignUp'
import { EmailValidator } from './signup-protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../../errors/'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutType{
  sut: SignUpController
  emailValidator: EmailValidator
  addAccountStub: AddAccount
}
const maketSut = (): SutType => {
  const emailValidator = makeEmailValidator()
  const addAccountStub = makeAddAcount()
  const sut = new SignUpController(emailValidator, addAccountStub)

  return {
    sut,
    emailValidator,
    addAccountStub
  }
}
const makeAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const accountFake = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return await Promise.resolve(accountFake)
    }
  }
  return new AddAccountStub()
}
describe('Signup controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = await await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',

        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = await await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpRespose = await await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no confirmPassword is provided', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        password: 'any_password'
      }
    }
    const httpRespose = await await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new MissingParamError('confirmPassword'))
  })
  test('Should return 400 if no confirmPassword is not equal to password', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        password: 'any_password',
        confirmPassword: 'invalid_pass'
      }
    }
    const httpRespose = await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new InvalidParamError('confirmPassword'))
  })
  test('Should return 400 if an invalid email is provided', async () => {
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
    const httpRespose = await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(400)
    expect(httpRespose.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call correct emailValidator with correct email', async () => {
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
    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any@example.com')
  })
  test('Should return error 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = maketSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = maketSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@example.com',
      password: 'any_password'
    })
  })
  test('Should return error 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = maketSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => reject(new Error())) })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@example.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = maketSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpRespose = await await sut.handle(httpRequest)
    expect(httpRespose.statusCode).toBe(200)
    expect(httpRespose.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
