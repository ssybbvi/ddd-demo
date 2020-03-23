import { dailySignInUseCase } from '../userCases/signIns/dailySignIn'
import { AfterLoginCreated } from './afterLoginCreated'
import { createRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser'
import { AfterUserCreated } from './afterUserCreated'
import { AfterRecommendedUserCreated } from './afterRecommendedUserCreated'
import { createRecommendedUserDistributionRelationUseCase } from '../userCases/recommendedUsers/createRecommendedUserDistributionRelation'

// Subscriptions
new AfterUserCreated(createRecommendedUser)
new AfterRecommendedUserCreated(createRecommendedUserDistributionRelationUseCase)
new AfterLoginCreated(dailySignInUseCase)

