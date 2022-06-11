
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignupValidation = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'confirmPassword']) { validations.push(new RequiredFieldValidation(field)) }
  validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
