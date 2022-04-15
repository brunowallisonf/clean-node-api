import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL as string}teste`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository()
    return sut
  }
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({ name: 'valid_name', password: 'pass', email: 'valid_email@gmail.com' })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.password).toBe('pass')
    expect(account.email).toBe('valid_email@gmail.com')
  })
})
