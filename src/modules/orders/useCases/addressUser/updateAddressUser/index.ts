import { UpdateAddressUserUseCase } from './updateAddressUserUseCase'
import { addressUserRepo } from '../../../repos'
import { UpdateAddressUserController } from './updateAddressUserController'

const updateAddressUserUseCase = new UpdateAddressUserUseCase(addressUserRepo)
const updateAddressUserController = new UpdateAddressUserController(updateAddressUserUseCase)

export { updateAddressUserUseCase, updateAddressUserController }
