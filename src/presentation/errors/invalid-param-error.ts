export class InvalidParamError extends Error {
  constructor (private readonly paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
