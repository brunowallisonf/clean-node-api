import { HttpRequest, Validation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { AddSurvey, AddSurveyModel } from '../../../../domain/usecases/add-survey'
interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }]
    }
  }
}
const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {

    }
  }
  return new AddSurveyStub()
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (value: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}
describe('Add SurveyController', function () {
  it('should call validationStub correctly', async function () {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('should return 400 if validation fails', async function () {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  it('should return 500 if validation throws', async function () {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeFakeRequest()
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(serverError(new Error()))
  })
  it('should call AddSurvey with correct values', async function () {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    const { question, answers } = httpRequest.body
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({ question, answers })
  })
  it('should return 500 if addSurvey throws', async function () {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeFakeRequest()
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(serverError(new Error()))
  })
  it('should return 204 on success', async function () {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
