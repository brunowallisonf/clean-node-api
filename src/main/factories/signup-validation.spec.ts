import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignupValidation } from './signup-validation'
jest.mock('../../presentation/helpers/validators/validation-composite')
describe('makeValidation', () => {
  test('Should call ValidationComposite with all validation', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) { validations.push(new RequiredFieldValidation(field)) }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
