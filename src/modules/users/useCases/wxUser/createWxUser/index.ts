import { CreateWxUserUseCase } from './createWxUserUseCase'
import { wxUserRepo } from '../../../repos'

const createWxUserUseCase = new CreateWxUserUseCase(wxUserRepo)

export { createWxUserUseCase }
