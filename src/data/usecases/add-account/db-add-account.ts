
import { AddAccount, AddAccountModel, Encrypter, AccountModel, AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encryptedPass = await this.encrypter.encrypt(account.password)
    const result = await this.addAccountRepository.add({ ...account, password: encryptedPass })
    return await Promise.resolve(result)
  };
}
