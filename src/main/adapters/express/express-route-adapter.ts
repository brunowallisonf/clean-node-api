import { Controller, HttpRequest } from '../../../presentation/protocols'
import { Request, Response } from 'express'
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const result = await controller.handle(httpRequest)
    if (result.statusCode === 200) {
      return res.status(result.statusCode).json(result.body)
    }
    return res.status(result.statusCode).json({ error: result.body.message })
  }
}
