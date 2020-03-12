import { createMember } from '../userCases/members/createMember'
import { getMemberUseCase } from '../userCases/members/getMember'
import { distributionFundUseCase } from '../userCases/funds/distributionFund'
import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'

import { AfterUserCreated } from './afterUserCreated'
import { AfterSignInCreated } from './afterSignInCreated'
import { AfterLoginCreated } from './afterLoginCreated'
import { fundService } from '../domain/services'
import { SignInSuperRewared } from '../domain/events/signInSuperRewared'
import { AfterSignInSuperRewared } from './afterSignInSuperRewared'
import { updateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount'
import { AfterFundCreated } from './afterFundCreated'
import { getTotalAmountByMemberIdUseCase } from '../userCases/funds/getTotalAmountByMemberId'

// Subscriptions
new AfterUserCreated(createMember, updateFundAccountUseCase)
new AfterSignInCreated(fundService)
new AfterLoginCreated(dailySignInUseCase)
new AfterSignInSuperRewared(fundService)
new AfterFundCreated(getTotalAmountByMemberIdUseCase, updateFundAccountUseCase)
