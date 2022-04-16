import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack as string)
  }
}
export const ok = (body): HttpResponse => {
  return {
    statusCode: 200,
    body
  }
}
