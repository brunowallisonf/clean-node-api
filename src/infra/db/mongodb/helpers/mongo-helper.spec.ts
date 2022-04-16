import { MongoHelper, MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(`${process.env.MONGO_URL}teste`)
  })
  afterAll(async () => await MongoHelper.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    let accountConnection = await sut.getCollection('accounts')
    expect(accountConnection).toBeTruthy()
    accountConnection = await sut.getCollection('accounts')
    await sut.disconnect()
  })
})
