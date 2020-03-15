import { UpdateFundAccountUseCase } from './updateFundAccountUseCase'
import { fundAccountRepo } from '../../../repos'

const updateFundAccountUseCase = new UpdateFundAccountUseCase(fundAccountRepo)

export { updateFundAccountUseCase }
