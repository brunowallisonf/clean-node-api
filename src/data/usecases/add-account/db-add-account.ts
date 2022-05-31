
import { AddAccount, AddAccountModel, Hasher, AccountModel, AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encryptedPass = await this.hasher.hash(account.password)
    const result = await this.addAccountRepository.add({ ...account, password: encryptedPass })
    return await Promise.resolve(result)
  };
}
