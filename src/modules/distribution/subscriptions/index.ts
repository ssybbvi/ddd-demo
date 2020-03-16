import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { createMember } from '../userCases/members/createMember'
import { AfterUserCreated } from './afterUserCreated'
import { AfterMemberCreated } from './afterMemberCreated'
import { createMemberDistributionRelationUseCase } from '../userCases/members/createMemberDistributionRelation'

// Subscriptions
new AfterUserCreated(createMember)
new AfterMemberCreated(createMemberDistributionRelationUseCase)
new AfterLoginCreated(dailySignInUseCase)
