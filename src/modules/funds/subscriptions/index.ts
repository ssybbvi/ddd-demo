
import { AfterUserCreated } from './afterUserCreated'
import { AfterSignInCreated } from './afterSignInCreated'
import { fundService } from '../domain/services'
import { refreshFundAccountUseCase } from '../userCases/fundAccounts/refreshFundAccount'
import { AfterFundCreated } from './afterFundCreated'
import { AfterSignInSuperRewared } from './afterSignInSuperRewared'
import { AfterOrderPaymented } from './afterOrderPaymented'
import { createFundUseCase } from '../userCases/funds/createFund'
import { AfterFundAccountCreated } from './afterFundAccountCreated'
import { createFundAccountUseCase } from '../userCases/fundAccounts/createFundAccount'
import { AfterDayDayTaskReceiveReward } from './afterDayDayTaskReceiveReward'
import { AfterFundInvalided } from './afterFundInvalided'
import { fundStatusChangeUseCase } from '../userCases/funds/fundStatusChange'
import { AfterOrderClosed } from './afterOrderClosed'

// Subscriptions
new AfterUserCreated(createFundAccountUseCase)
new AfterSignInCreated(fundService)
new AfterSignInSuperRewared(fundService)
new AfterFundCreated(refreshFundAccountUseCase)
new AfterOrderPaymented(createFundUseCase)
new AfterFundAccountCreated(createFundUseCase)
new AfterDayDayTaskReceiveReward(fundService)
new AfterFundInvalided(refreshFundAccountUseCase)
new AfterOrderClosed(fundStatusChangeUseCase)