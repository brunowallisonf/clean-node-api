
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          ok: 'true'
        }
      }
    }
  }

  return new ControllerStub()
}
const makeSut = (): {sut: LogControllerDecorator, controllerStub: Controller} => {
  const controllerStub = makeControllerStub()
  return { sut: new LogControllerDecorator(controllerStub), controllerStub }
}
describe('LogController decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const callSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    }
    await sut.handle(httpRequest)
    expect(callSpy).toHaveBeenCalledWith(httpRequest)
  })
})
