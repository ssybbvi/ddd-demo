import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { SignInCreated } from '../domain/events/signInCreated'
import { DistributionFundUseCase } from '../userCases/funds/distributionFund/distributionFundUseCase'
import { GetMemberUseCase } from '../userCases/members/getMember/getMemberUseCase'
import { GetMemberDto } from '../userCases/members/getMember/getMemberDto'
import { MemberDTO } from '../dtos/memberDTO'
import { Result } from '../../../shared/core/Result'
import { DistributionFundDto, DistributionRelationDto } from '../userCases/funds/distributionFund/distributionFundDto'
import { FundService } from '../domain/services/fundService'

export class AfterSignInCreated implements IHandle<SignInCreated> {
  private fundService: FundService

  constructor(fundService: FundService) {
    this.setupSubscriptions()
    this.fundService = fundService
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterSignInCreated.bind(this), SignInCreated.name)
  }

  private async onAfterSignInCreated(event: SignInCreated): Promise<void> {
    const { signIn } = event

    try {
      let result = await this.fundService.signInRewared(signIn, 'signIn')
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[AfterSignInCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterSignInCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
