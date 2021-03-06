import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
interface SutTypes {
  validationStubs: Validation[]
  sut: ValidationComposite
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (value: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

describe('Validation Composite', function () {
  test('Should return an error if any validation fails', function () {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should return the first error more then one fails', function () {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error('field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error('field'))
  })
  test('Should not return if succeeds', function () {
    const { sut } = makeSut()
    const result = sut.validate({ field: 'any_value' })
    expect(result).toBeFalsy()
  })
})
