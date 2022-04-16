export class ServerError extends Error {
  constructor (stackTrace: string) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.stack = stackTrace
  }
}
