
import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'
const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareFields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const result = sut.validate({ field: 'value', fieldToCompare: 'wrong_value' })
    expect(result).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const result = sut.validate({ field: 'value', fieldToCompare: 'value' })
    expect(result).toBeFalsy()
  })
})
