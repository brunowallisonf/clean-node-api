import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
describe('', () => {
  describe('POST /signup', () => {
    beforeAll(async () => {
      await MongoHelper.connect(`${process.env.MONGO_URL}teste`)
    })
    afterAll(async () => {
      await MongoHelper.disconnect()
    })

    beforeEach(async () => {
      const accountCollection = await MongoHelper.getCollection('accounts')
      await accountCollection.deleteMany({})
    })
    test('Should return 200 on signup', async () => {
      await request(app).post('/api/signup').send({ name: 'bruno', email: 'valid_email@gmail.com', password: '123456', confirmPassword: '123456' }).expect(200)
    })
  })
})
