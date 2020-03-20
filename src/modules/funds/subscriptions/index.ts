
import { AfterUserCreated } from './afterUserCreated'
import { AfterSignInCreated } from './afterSignInCreated'
import { fundService } from '../domain/services'
import { updateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount'
import { AfterFundCreated } from './afterFundCreated'
import { getTotalAmountByMemberIdUseCase } from '../userCases/funds/getTotalAmountByMemberId'
import { createMember } from '../../distribution/userCases/members/createMember'
import { AfterSignInSuperRewared } from './afterSignInSuperRewared'

// Subscriptions
new AfterUserCreated(updateFundAccountUseCase)
new AfterSignInCreated(fundService)
new AfterSignInSuperRewared(fundService)
new AfterFundCreated(getTotalAmountByMemberIdUseCase, updateFundAccountUseCase)
