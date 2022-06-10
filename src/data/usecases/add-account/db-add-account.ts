
import { AddAccount, AddAccountModel, Hasher, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository, private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountFound = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (accountFound) {
      return null
    }
    const encryptedPass = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add({ ...account, password: encryptedPass })
  };
}
