import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../presentation/errors'
const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const result = sut.validate({})
    expect(result).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const result = sut.validate({ field: '1234' })
    expect(result).toBeFalsy()
  })
})
