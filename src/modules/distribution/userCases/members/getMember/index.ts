import { GetMemberUseCase } from './getMemberUseCase'
import { memberRepo } from '../../../repos'

const getMemberUseCase = new GetMemberUseCase(memberRepo)

export { getMemberUseCase }
