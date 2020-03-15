import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { GetMemberDto } from './getMemberDto'
import { MemberDTO } from '../../../dtos/memberDTO'
import { MemberMap } from '../../../mappers/memberMap'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<MemberDTO>>

export class GetMemberUseCase implements UseCase<GetMemberDto, Promise<Response>> {
  private memberRepo: IMemberRepo

  constructor(memberRepo: IMemberRepo) {
    this.memberRepo = memberRepo
  }

  public async execute(request: GetMemberDto): Promise<Response> {
    try {
      const { memberId } = request
      let member = await this.memberRepo.getById(memberId)
      let memberDto = MemberMap.toDTO(member)
      return right(Result.ok<MemberDTO>(memberDto))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
