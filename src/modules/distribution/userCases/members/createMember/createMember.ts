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
    const { userId } = request

    try {
      let memberExists = await this.memberRepo.existsByUserId(userId)
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

      const memberOrError: Result<Member> = Member.create({
        userId: userIdOrError.getValue(),
        inviteMemberId: inviteMemberId,
        createAt: 0,
        inviteToken: ''
      })

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
