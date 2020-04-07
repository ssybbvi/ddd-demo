import { CraeteUseCase } from './craeteUseCase'
import { userRepo } from '../../../repos'

const craeteUseCase = new CraeteUseCase(userRepo)

export { craeteUseCase }
