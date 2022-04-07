import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export default (value: AddAccountModel, insertedId: string): AccountModel => ({ ...value, id: insertedId })
