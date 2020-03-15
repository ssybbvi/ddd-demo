import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { createMember } from '../userCases/members/createMember'
import { AfterUserCreated } from './afterUserCreated'

// Subscriptions
new AfterUserCreated(createMember)
new AfterLoginCreated(dailySignInUseCase)
