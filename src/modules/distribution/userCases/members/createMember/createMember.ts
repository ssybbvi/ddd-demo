import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { CreateMemberDTO } from './CreateMemberDTO'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { CreateMemberErrors } from './CreateMemberErrors'
import { Member } from '../../../domain/member'
import { MemberId } from '../../../domain/memberId'
import { UserId } from '../../../../users/domain/userId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { MemberDistributionRelation } from '../../../domain/memberDistributionRelation'
import { FundType } from '../../../domain/fundType'

type Response = Either<
  | CreateMemberErrors.MemberAlreadyExistsError
  | CreateMemberErrors.UserDoesntExistError
  | CreateMemberErrors.InviteMemberNotExists
  | AppError.UnexpectedError
  | Result<any>,
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

export class CreateMember implements UseCase<CreateMemberDTO, Promise<Response>> {
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

  public async execute(request: CreateMemberDTO): Promise<Response> {
    const { userId } = request

    try {
      let memberExists = await this.memberRepo.existsById(userId)
      if (memberExists) {
        return left(new CreateMemberErrors.MemberAlreadyExistsError(userId))
      }

      let userIdOrError = UserId.create(new UniqueEntityID(request.userId))
      if (userIdOrError.isFailure) {
        return left(userIdOrError)
      }

      let inviteMemberId: MemberId = null
      if (!!request.inviteToken) {
        let inviteMemberExists = await this.memberRepo.existsByInviteToken(request.inviteToken)
        if (!inviteMemberExists) {
          return left(new CreateMemberErrors.InviteMemberNotExists(request.inviteToken))
        }

        let inviteMember = await this.memberRepo.getByInviteToken(request.inviteToken)
        inviteMemberId = inviteMember.memberId
      }

      const memberOrError: Result<Member> = Member.create(
        {
          inviteMemberId: inviteMemberId,
          createAt: 0,
          inviteToken: request.userId,
          amount: 0,
          distributionRelationList: []
        },
        new UniqueEntityID(request.userId)
      )

      if (memberOrError.isFailure) {
        return left(memberOrError)
      }

      let member = memberOrError.getValue()

      await this.memberRepo.save(member)
      /////////////

      let newMember = await this.memberRepo.getById(member.id.toString())

      let createMemberDistributionRelationResponse = await this.createMemberDistributionRelation(
        newMember.memberId.id.toString(),
        this.inviteDistributionRewardRelationList,
        []
      )

      let createMemberDistributionRelationResponseValue = createMemberDistributionRelationResponse.value
      console.log('createMemberDistributionRelationResponseValue:::::', createMemberDistributionRelationResponseValue)
      if (createMemberDistributionRelationResponse.isLeft()) {
        return left(createMemberDistributionRelationResponseValue)
      }

      newMember.updateDistributionRelationList(createMemberDistributionRelationResponseValue.getValue())
      await this.memberRepo.save(newMember)

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
        memberId: member.inviteMemberId.id.toString(),
        distributionRate: inviteDistributionRewardRelation.distributionRate,
        fundType: inviteDistributionRewardRelation.fundType
      })

      if (memberDistributionRelationOrErrors.isFailure) {
        return left(memberDistributionRelationOrErrors)
      }

      memberDistributionRelationList.push(memberDistributionRelationOrErrors.getValue())

      await this.createMemberDistributionRelation(
        member.inviteMemberId.id.toString(),
        inviteDistributionRewardRelationList,
        memberDistributionRelationList
      )
    }

    return right(Result.ok<MemberDistributionRelation[]>(memberDistributionRelationList))
  }
}
