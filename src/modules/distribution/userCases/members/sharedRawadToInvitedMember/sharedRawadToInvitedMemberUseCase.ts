import { UseCase } from '../../../../../shared/core/UseCase'
import { Member } from '../../../domain/member'
import { IMemberRepo } from '../../../repos/memberRepo'
import { left, right, Result, Either } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { SharedRawadToInvitedMemberDto } from './sharedRawadToInvitedMemberDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class shared implements UseCase<SharedRawadToInvitedMemberDto, Promise<Response>> {
  private memberRepo: IMemberRepo

  constructor(memberRepo: IMemberRepo) {
    this.memberRepo = memberRepo
  }

  public async execute(req: SharedRawadToInvitedMemberDto): Promise<Response> {
    try {
      let member = await this.memberRepo.getById(req.userId)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
