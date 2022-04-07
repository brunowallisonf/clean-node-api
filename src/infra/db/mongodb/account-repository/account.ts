import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import accountMapper from './account-mapper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (value: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(value)
    return await new Promise((resolve) => resolve(accountMapper(value, result.insertedId.toString())))
  }
}
