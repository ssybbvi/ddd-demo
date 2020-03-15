import { fundRepo } from '../../../repos'

import { GetTotalAmountByMemberIdUseCase } from './getTotalAmountByMemberIdUseCase'

const getTotalAmountByMemberIdUseCase = new GetTotalAmountByMemberIdUseCase(fundRepo)

export { getTotalAmountByMemberIdUseCase }
