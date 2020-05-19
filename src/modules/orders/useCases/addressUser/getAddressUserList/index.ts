import { GetAddressUserListUseCase } from './getAddressUserListUseCase'
import { addressUserRepo } from '../../../repos'
import { GetAddressUserListController } from './getAddressUserListController'

const getAddressUserListUseCase = new GetAddressUserListUseCase(addressUserRepo)
const getAddressUserListController = new GetAddressUserListController(getAddressUserListUseCase)

export { getAddressUserListUseCase, getAddressUserListController }
