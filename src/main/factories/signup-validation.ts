
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'

export const makeSignupValidation = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'confirmPassword']) { validations.push(new RequiredFieldValidation(field)) }
  return new ValidationComposite(validations)
}
