import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
let accountCollection = null
describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}teste`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository()
    return sut
  }
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({ name: 'valid_name', password: 'pass', email: 'valid_email@gmail.com' })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.password).toBe('pass')
    expect(account.email).toBe('valid_email@gmail.com')
  })
  test('should return an account on loadByEmailSuccess', async () => {
    await accountCollection.insertOne({ name: 'valid_name', email: 'any_email@mail.com', password: 'pass' })
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.password).toBe('pass')
    expect(account.email).toBe('any_email@mail.com')
  })
  test('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })
  test('should update the account access token on updateAccessTokenSuccess', async () => {
    const res = await accountCollection.insertOne({ name: 'valid_name', email: 'any_email@mail.com', password: 'pass' })
    const sut = makeSut()
    let account = await accountCollection.findOne({ _id: res.insertedId })
    expect(account.accessToken).toBeFalsy()
    await sut.updateAccessToken(res.insertedId, 'any_token')
    account = await accountCollection.findOne({ _id: res.insertedId })
    expect(account).toBeTruthy()
    expect(account.accessToken).toEqual('any_token')
  })
})
