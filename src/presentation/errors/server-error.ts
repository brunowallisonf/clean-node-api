export class ServerError extends Error {
  constructor (private readonly stackTrace: string) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.stack = stackTrace
  }
}
