import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { createRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser'
import { AfterRecommendedUserCreated } from './afterRecommendedUserCreated'
import { createRecommendedUserDistributionRelationUseCase } from '../userCases/recommendedUsers/createRecommendedUserDistributionRelation'
import { AfterUserUpdateInviteRecommendedUserIded } from './afterUserUpdateInviteRecommendedUserIded'

// Subscriptions
new AfterUserUpdateInviteRecommendedUserIded(createRecommendedUser)
new AfterRecommendedUserCreated(createRecommendedUserDistributionRelationUseCase)
new AfterLoginCreated(dailySignInUseCase)
