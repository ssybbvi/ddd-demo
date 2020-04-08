import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { AfterUserUpdateInviteRecommendedUserIded } from './afterUserUpdateInviteRecommendedUserIded'
import { createRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser'
import { AfterUserCreated } from './afterUserC'

// Subscriptions
new AfterLoginCreated(dailySignInUseCase)
new AfterUserUpdateInviteRecommendedUserIded(createRecommendedUser)
new AfterUserCreated(createRecommendedUser)
