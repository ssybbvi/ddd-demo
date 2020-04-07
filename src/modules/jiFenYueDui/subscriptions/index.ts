import { getUserByInviteRecommendedUserIdUseCase } from '../../users/useCases/user/getUserByInviteRecommendedUserId'
import { completeTaskUseCase } from '../userCases/dayDayTask/completeTask'
import { AfterUserCreated } from './afterUserCreated'
import { AfterOrderPaymented } from './afterOrderPaymented'
import { AfterDayDayTaskCreated } from './afterDayDayTaskCreated'
import { createScheduledTaskUseCase } from '../userCases/scheduledTask/createScheduledTask'
import { getWxCurrentUserUseCase } from '../../users/useCases/wxUser/getWxCurrentUser'
import { getDailySignInCountByUserIdUseCase } from '../../distribution/userCases/signIns/getDailySignInCountByUserId'

new AfterUserCreated(completeTaskUseCase, getUserByInviteRecommendedUserIdUseCase)
new AfterOrderPaymented(completeTaskUseCase)
new AfterDayDayTaskCreated(createScheduledTaskUseCase, getWxCurrentUserUseCase, getDailySignInCountByUserIdUseCase)
