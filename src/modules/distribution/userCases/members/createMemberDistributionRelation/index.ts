import { CreateMemberDistributionRelationUseCase } from './createMemberDistributionRelationUseCase'
import { memberRepo } from '../../../repos'

let createMemberDistributionRelationUseCase = new CreateMemberDistributionRelationUseCase(memberRepo)

export { createMemberDistributionRelationUseCase }
