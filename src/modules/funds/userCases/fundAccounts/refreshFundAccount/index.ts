import { RefreshFundAccountUseCase } from './refreshFundAccountUseCase'
import { fundAccountRepo, fundRepo } from '../../../repos'

const refreshFundAccountUseCase = new RefreshFundAccountUseCase(fundAccountRepo,fundRepo)

export { refreshFundAccountUseCase }
