import { getUserByInviteRecommendedUserIdUseCase } from '../../users/useCases/user/getUserByInviteRecommendedUserId'
import { completeTaskUseCase } from '../userCases/dayDayTask/completeTask'
import { AfterUserCreated } from './afterUserCreated'
import { AfterOrderPaymented } from './afterOrderPaymented'
import { AfterDayDayTaskCreated } from './afterDayDayTaskCreated'
import { createScheduledTaskUseCase } from '../userCases/scheduledTask/createScheduledTask'
import { getWxCurrentUserUseCase } from '../../users/useCases/wxUser/getWxCurrentUser'
import { getDailySignInCountByUserIdUseCase } from '../../distribution/userCases/signIns/getDailySignInCountByUserId'
import { AfterWxUserBindingPhoneNumber } from './afterWxUserBindingPhoneNumber'
import { AfterUserUpdateInviteRecommendedUserIded } from './afterUserUpdateInviteRecommendedUserIded'

new AfterUserCreated(completeTaskUseCase)
new AfterOrderPaymented(completeTaskUseCase)
new AfterDayDayTaskCreated(createScheduledTaskUseCase, getWxCurrentUserUseCase, getDailySignInCountByUserIdUseCase)
new AfterWxUserBindingPhoneNumber(completeTaskUseCase)
new AfterUserUpdateInviteRecommendedUserIded(completeTaskUseCase, getUserByInviteRecommendedUserIdUseCase)
