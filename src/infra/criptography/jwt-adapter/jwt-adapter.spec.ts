import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter.'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('token'))
  }
}))
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('Jwt Adapter', function () {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const sut = makeSut()

    const token = await sut.encrypt('any_value')
    expect(token).toBe('token')
  })
  test('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
