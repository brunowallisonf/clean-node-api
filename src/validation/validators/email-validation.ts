import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../../presentation/protocols'
import { Validation } from '../../presentation/protocols/validation'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string,
    private readonly emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
