import { createMember } from '../userCases/members/createMember'
import { getMemberUseCase } from '../userCases/members/getMember'
import { distributionFundUseCase } from '../userCases/funds/distributionFund'

import { AfterUserCreated } from './afterUserCreated'
import { AfterSignInCreated } from './afterSignInCreated'

// Subscriptions
new AfterUserCreated(createMember)
new AfterSignInCreated(distributionFundUseCase, getMemberUseCase)
