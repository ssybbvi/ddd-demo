import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { MemberDistributionRelation } from '../../../domain/memberDistributionRelation'
import { FundType } from '../../../../funds/domain/fundType'
import { CreateMemberDistributionRelationDto } from './createMemberDistributionRelationDto'
import { CreateMemberErrors } from '../createMember/CreateMemberErrors'

type Response = Either<
  CreateMemberErrors.MemberAlreadyExistsError | AppError.UnexpectedError | Result<any>,
  Result<void>
>

type CreateMemberDistributionRelationResponse = Either<
  AppError.UnexpectedError | Result<any>,
  Result<MemberDistributionRelation[]>
>

interface inviteDistributionRewardRelation {
  distributionRate: number
  fundType: FundType
}

export class CreateMemberDistributionRelationUseCase
  implements UseCase<CreateMemberDistributionRelationDto, Promise<Response>> {
  private memberRepo: IMemberRepo
  private inviteDistributionRewardRelationList: inviteDistributionRewardRelation[] = [
    {
      distributionRate: 0.1,
      fundType: 'primaryDistribution'
    },
    {
      distributionRate: 0.05,
      fundType: 'secondaryDistribution'
    }
  ]

  constructor(memberRepo: IMemberRepo) {
    this.memberRepo = memberRepo
  }

  public async execute(request: CreateMemberDistributionRelationDto): Promise<Response> {
    const { memberId } = request
    try {
      let member = await this.memberRepo.getById(memberId)

      let inviteDistributionRewardRelationListTemp = JSON.parse(
        JSON.stringify(this.inviteDistributionRewardRelationList)
      )
      let createMemberDistributionRelationResponse = await this.createMemberDistributionRelation(
        member.memberId.id.toString(),
        inviteDistributionRewardRelationListTemp,
        []
      )

      let createMemberDistributionRelationResponseValue = createMemberDistributionRelationResponse.value
      if (createMemberDistributionRelationResponse.isLeft()) {
        return left(createMemberDistributionRelationResponseValue)
      }

      member.updateDistributionRelationList(createMemberDistributionRelationResponseValue.getValue())
      await this.memberRepo.save(member)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }

  private async createMemberDistributionRelation(
    memberId: string,
    inviteDistributionRewardRelationList: inviteDistributionRewardRelation[],
    memberDistributionRelationList: MemberDistributionRelation[]
  ): Promise<CreateMemberDistributionRelationResponse> {
    let existMember = await this.memberRepo.existsById(memberId)
    if (!existMember) {
      return right(Result.ok<MemberDistributionRelation[]>(memberDistributionRelationList))
    }
    let member = await this.memberRepo.getById(memberId)

    if (!!member.inviteMemberId && !!inviteDistributionRewardRelationList.length) {
      let inviteDistributionRewardRelation = inviteDistributionRewardRelationList.shift()

      let memberDistributionRelationOrErrors = MemberDistributionRelation.create({
        memberId: member.inviteMemberId,
        distributionRate: inviteDistributionRewardRelation.distributionRate,
        fundType: inviteDistributionRewardRelation.fundType
      })

      if (memberDistributionRelationOrErrors.isFailure) {
        return left(memberDistributionRelationOrErrors)
      }

      memberDistributionRelationList.push(memberDistributionRelationOrErrors.getValue())

      await this.createMemberDistributionRelation(
        member.inviteMemberId,
        inviteDistributionRewardRelationList,
        memberDistributionRelationList
      )
    }

    return right(Result.ok<MemberDistributionRelation[]>(memberDistributionRelationList))
  }
}
