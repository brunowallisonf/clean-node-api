
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password'
  }
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(makeFakeAccount())
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (value: string): Promise<void> {

    }
  }
  return new LogErrorRepositoryStub()
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})
interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  return { sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub), controllerStub, logErrorRepositoryStub }
}
describe('LogController decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const callSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(callSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result as the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => await Promise.resolve(error))
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
