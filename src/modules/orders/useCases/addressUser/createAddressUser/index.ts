import { CreateAddressUserUseCase } from './createAddressUserUseCase'
import { addressUserRepo } from '../../../repos'
import { CreateAddressUserController } from './createAddressUserController'

const createAddressUserUseCase = new CreateAddressUserUseCase(addressUserRepo)
const createAddressUserController = new CreateAddressUserController(createAddressUserUseCase)
export { createAddressUserUseCase, createAddressUserController }
