import { UnauthorizedError, ServerError } from '../../errors'
import { HttpResponse } from '../../protocols'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const unauthorized = (): HttpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}
export const ok = (body): HttpResponse => {
  return {
    statusCode: 200,
    body
  }
}
