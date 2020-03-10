import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { SignInCreated } from '../domain/events/signInCreated'
import { DistributionFundUseCase } from '../userCases/funds/distributionFund/distributionFundUseCase'
import { GetMemberUseCase } from '../userCases/members/getMember/getMemberUseCase'
import { GetMemberDto } from '../userCases/members/getMember/getMemberDto'
import { MemberDTO } from '../dtos/memberDTO'
import { Result } from '../../../shared/core/Result'
import { DistributionFundDto, DistributionRelationDto } from '../userCases/funds/distributionFund/distributionFundDto'

export class AfterSignInCreated implements IHandle<SignInCreated> {
  private distributionFundUseCase: DistributionFundUseCase
  private getMemberUseCase: GetMemberUseCase

  constructor(distributionFundUseCase: DistributionFundUseCase, getMemberUseCase: GetMemberUseCase) {
    this.setupSubscriptions()
    this.distributionFundUseCase = distributionFundUseCase
    this.getMemberUseCase = getMemberUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), SignInCreated.name)
  }

  private async onUserCreated(event: SignInCreated): Promise<void> {
    const { signIn } = event

    try {
      let getMemberDto: GetMemberDto = { memberId: signIn.signInMemberId }
      let memberDtoResultValue = await this.getMemberUseCase.execute(getMemberDto)

      if (memberDtoResultValue.isLeft()) {
        console.error(memberDtoResultValue.value)
      }

      let distributionRelationDtoList: DistributionRelationDto[] = memberDtoResultValue.value
        .getValue()
        .distributionRelationList.map(item => {
          return {
            memberId: item.memberId,
            distributionRate: item.distributionRate,
            fundType: item.fundType
          }
        })
      let distributionFundDto: DistributionFundDto = {
        memberId: getMemberDto.memberId,
        amount: signIn.reward,
        fundType: 'signIn',
        relationId: signIn.id.toString(),
        distributionRelationList: distributionRelationDtoList
      }
      await this.distributionFundUseCase.execute(distributionFundDto)

      console.log(`[AfterSignInCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterSignInCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
