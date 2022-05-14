
import { serverError, badRequest, unauthorized } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication } from './login-protocols'
import { Validation } from '../../protocols/validation'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication
  constructor (validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return {
        statusCode: 200,
        body: { accessToken }
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
