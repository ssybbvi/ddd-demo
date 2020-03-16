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
import { FundType } from '../../../../funds/domain/fundType'

type Response = Either<
  | CreateMemberErrors.MemberAlreadyExistsError
  | CreateMemberErrors.UserDoesntExistError
  | CreateMemberErrors.InviteMemberNotExists
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

export class CreateMember implements UseCase<CreateMemberDTO, Promise<Response>> {
  private memberRepo: IMemberRepo

  constructor(memberRepo: IMemberRepo) {
    this.memberRepo = memberRepo
  }

  public async execute(request: CreateMemberDTO): Promise<Response> {
    const { userId, inviteToken } = request

    try {
      let memberExists = await this.memberRepo.existsById(userId)
      if (memberExists) {
        return left(new CreateMemberErrors.MemberAlreadyExistsError(userId))
      }

      let inviteMemberId: string = null //inviteToken //TODO
      if (!!inviteToken) {
        let inviteMemberExists = await this.memberRepo.existsByInviteToken(inviteToken)
        // if (!inviteMemberExists) {
        //   return left(new CreateMemberErrors.InviteMemberNotExists(request.inviteToken))
        // }

        if (inviteMemberExists) {
          let inviteMember = await this.memberRepo.getByInviteToken(inviteToken)
          inviteMemberId = inviteMember.memberId.id.toString()
        } else {
          console.log(`找不到邀请人:${inviteToken}`)
        }
      }

      const memberOrError: Result<Member> = Member.create(
        {
          inviteMemberId: inviteMemberId,
          inviteToken: userId,
          distributionRelationList: []
        },
        new UniqueEntityID(userId),
        true
      )

      if (memberOrError.isFailure) {
        return left(memberOrError)
      }

      let member = memberOrError.getValue()

      await this.memberRepo.save(member)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
