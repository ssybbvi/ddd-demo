import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { AfterUserUpdateInviteRecommendedUserIded } from './afterUserUpdateInviteRecommendedUserIded'
import { createRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser'

// Subscriptions
new AfterLoginCreated(dailySignInUseCase)
new AfterUserUpdateInviteRecommendedUserIded(createRecommendedUser)
