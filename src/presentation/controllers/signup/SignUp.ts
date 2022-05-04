
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator, Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors/'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const result = await this.addAccount.add({ name, email, password })
      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
