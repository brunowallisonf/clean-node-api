import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
MongoHelper.connect(env.mongoUrl).then(async () => {
  console.log('conectou aqui')
  const app = (await import ('./config/app')).default
  app.listen(env.port, () => console.log('Server runing at http://localhost:5050'))
}).catch(console.error)
