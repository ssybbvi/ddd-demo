import { createMember } from '../userCases/members/createMember'
import { getMemberUseCase } from '../userCases/members/getMember'
import { distributionFundUseCase } from '../userCases/funds/distributionFund'
import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'

import { AfterUserCreated } from './afterUserCreated'
import { AfterSignInCreated } from './afterSignInCreated'
import { AfterLoginCreated } from './afterLoginCreated'

// Subscriptions
new AfterUserCreated(createMember)
new AfterSignInCreated(distributionFundUseCase, getMemberUseCase)
new AfterLoginCreated(dailySignInUseCase)
