import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): Boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  const sut = new EmailValidatorAdapter()
  return sut
}
describe('EmailValidator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail..com')

    expect(isValid).toBe(false)
  })
  test('should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid@mail.com')

    expect(isValid).toBe(true)
  })
  test('should call validator with correct email', () => {
    const sut = makeSut()
    const spy = jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    sut.isValid('valid@mail.com')

    expect(spy).toBeCalledWith('valid@mail.com')
  })
})
