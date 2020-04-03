import { getUserByInviteRecommendedUserIdUseCase } from '../../users/useCases/getUserByInviteRecommendedUserId'
import { completeTaskUseCase } from '../userCases/completeTask'
import { AfterUserCreated } from './afterUserCreated'
import { AfterOrderPaymented } from './afterOrderPaymented'

new AfterUserCreated(completeTaskUseCase, getUserByInviteRecommendedUserIdUseCase)
new AfterOrderPaymented(completeTaskUseCase)
