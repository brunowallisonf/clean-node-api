import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation, EmailValidator } from '../../../../presentation/protocols'

import { makeSignupValidation } from './signup-validation-factory'
jest.mock('../../../../validation/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('makeValidation', () => {
  test('Should call ValidationComposite with all validation', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) { validations.push(new RequiredFieldValidation(field)) }
    validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
