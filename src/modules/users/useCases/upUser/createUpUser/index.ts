import { upUserRepo } from '../../../repos'
import { CreateUpUserUseCase } from './createUpUserUseCase'
import { CreateUpUserController } from './createUpUserController'

const createUpUserUseCase = new CreateUpUserUseCase(upUserRepo)
const createUpUserController = new CreateUpUserController(createUpUserUseCase)
export { createUpUserUseCase, createUpUserController }
