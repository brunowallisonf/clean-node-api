import express from 'express'
import setupMiddlewares from './middlewares'
import configRoutes from './routes'
const app = express()
setupMiddlewares(app)
configRoutes(app)
export default app
