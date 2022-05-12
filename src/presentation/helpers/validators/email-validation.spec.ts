
import { InvalidParamError } from '../../errors/'
import { EmailValidator } from '../../protocols'

import { EmailValidation } from './email-validation'
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutType{
  sut: EmailValidation
  emailValidator: EmailValidator

}
const maketSut = (): SutType => {
  const emailValidator = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidator)

  return {
    sut,
    emailValidator
  }
}

describe('EmailValidation', () => {
  test('Should return InvalidParamError if an invalid email is provided', async () => {
    const { sut, emailValidator } = maketSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({ email: 'invalid_email' })
    expect(result).toEqual(new InvalidParamError('email'))
  })
  test('Should return call emailvalidator with correct email', async () => {
    const { sut, emailValidator } = maketSut()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')
    sut.validate({ email: 'invalid_email' })

    expect(emailValidatorSpy).toBeCalledWith('invalid_email')
  })
  test('Should throws if emailValidator throws', async () => {
    const { sut, emailValidator } = maketSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrowError()
  })

  test('Should return undefined  if emailValidator return true', async () => {
    const { sut } = maketSut()
    const result = sut.validate('valid_email')
    expect(result).toEqual(undefined)
  })
})
