import { IFundRepo } from '../../repos/iFundRepo'
import { Fund } from '../fund'
import { SignIn } from '../signIn'
import { Member } from '../member'
import { FundAmount } from '../fundAmount'
import { left } from '../../../../shared/core/Result'
import { MemberId } from '../memberId'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { FundStatus } from '../fundStatus'
import { FundType } from '../fundType'
import { IMemberRepo } from '../../repos/memberRepo'

export class SharedRewardToInvitedMemberService {
  private systemPaymentMemberId: '0'
  private fundRepo: IFundRepo
  private memberRepo: IMemberRepo

  constructor(fundRepo: IFundRepo, memberRepo: IMemberRepo) {
    this.fundRepo = fundRepo
    this.memberRepo = memberRepo
  }

  private async createFund(rewardFundDto: RewardFundDto) {
    const { amount, incomeMemberId, paymentMemberId, status, type, descrpiton, relationId } = rewardFundDto
    const fundAmountOrError = FundAmount.create({
      fundAmount: amount
    })

    // if (fundAmountOrError.isFailure) {
    //   return left(new CreateFundErrors.FundAmountError(amount))
    // }

    const incomeMemberIdOrError = MemberId.create(new UniqueEntityID(incomeMemberId))
    if (incomeMemberIdOrError.isFailure) {
      return left(incomeMemberIdOrError)
    }

    const paymentMemberIdOrError = MemberId.create(new UniqueEntityID(paymentMemberId))
    if (paymentMemberIdOrError.isFailure) {
      return left(paymentMemberIdOrError)
    }

    let fundOrError = Fund.create({
      amount: fundAmountOrError.getValue(),
      status: status,
      incomeMemberId: incomeMemberIdOrError.getValue(),
      paymentMemberId: paymentMemberIdOrError.getValue(),
      createAt: Date.now(),
      descrpiton,
      type,
      relationId
    })

    if (fundOrError.isFailure) {
      return left(fundOrError)
    }

    await this.fundRepo.save(fundOrError.getValue())
  }

  private async rewardParentInviteMemberToFund(rewardFundDto: RewardFundDto) {
    const { incomeMemberId } = rewardFundDto
    const member = await this.memberRepo.getById(incomeMemberId)
    if (!!member.inviteMemberId) {
      rewardFundDto.paymentMemberId = member.id.toString()
      rewardFundDto.incomeMemberId = member.inviteMemberId.id.toString()
      rewardFundDto.type = 'primaryDistribution'
      rewardFundDto.amount = Math.ceil(rewardFundDto.amount / 2)
      await this.createFund(rewardFundDto)

      let fatherInviteMember = await this.memberRepo.getById(member.inviteMemberId.id.toString())
      if (!!fatherInviteMember.inviteMemberId) {
        rewardFundDto.paymentMemberId = member.id.toString()
        rewardFundDto.incomeMemberId = member.inviteMemberId.id.toString()
        rewardFundDto.type = 'secondaryDistribution'
        rewardFundDto.amount = Math.ceil(rewardFundDto.amount / 2)
        await this.createFund(rewardFundDto)
      }
    }
  }

  public async reward(rewardFundDto: RewardFundDto) {
    await this.createFund(rewardFundDto)
    await this.rewardParentInviteMemberToFund(rewardFundDto)
  }

  public rewardSignIn(signIn: SignIn) {
    this.reward({
      amount: signIn.reward,
      incomeMemberId: signIn.signInMemberId,
      paymentMemberId: this.systemPaymentMemberId,
      status: 'valid',
      type: 'signIn',
      descrpiton: '',
      relationId: signIn.id.toString()
    })
  }
}

export interface RewardFundDto {
  amount: number
  incomeMemberId: string
  paymentMemberId: string
  status: FundStatus
  type: FundType
  descrpiton: string
  relationId: string
}
