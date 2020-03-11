import { User } from '../../users/domain/user'
import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateMember } from '../userCases/members/createMember/createMember'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { SignInSuperRewared } from '../domain/events/signInSuperRewared'
import { GetMemberDto } from '../userCases/members/getMember/getMemberDto'
import { GetMemberUseCase } from '../userCases/members/getMember/getMemberUseCase'
import { DistributionFundUseCase } from '../userCases/funds/distributionFund/distributionFundUseCase'
import { DistributionRelationDto, DistributionFundDto } from '../userCases/funds/distributionFund/distributionFundDto'
import { FundService } from '../domain/services/fundService'

export class AfterSignInSuperRewared implements IHandle<SignInSuperRewared> {
  private fundService: FundService

  constructor(fundService: FundService) {
    this.setupSubscriptions()
    this.fundService = fundService
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), SignInSuperRewared.name)
  }

  private async onUserCreated(event: SignInSuperRewared): Promise<void> {
    const { signIn } = event
    try {
      let result = await this.fundService.signInRewared(signIn, 'signInSuperReward')
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
