import { upUserRepo } from '../../../repos'
import { CreateUpUseCase } from './createUpUserUseCase'

const createUpUseCase = new CreateUpUseCase(upUserRepo)
export { createUpUseCase }
