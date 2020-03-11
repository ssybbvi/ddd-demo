import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { Member } from '../../../domain/member'
import { MemberId } from '../../../domain/memberId'
import { UserId } from '../../../../users/domain/userId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { IFundRepo } from '../../../repos/iFundRepo'
import { FundAmount } from '../../../domain/fundAmount'
import { Fund } from '../../../domain/fund'
import { FundType } from '../../../domain/fundType'
import { GetFundAccountDto } from './getFundAccountDto'
import { IFundAccountRepo } from '../../../repos/iFundAccountRepo'
import { FundAccount } from '../../../domain/fundAccount'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<FundAccount>>

export class GetFundAccountUseCase implements UseCase<GetFundAccountDto, Promise<Response>> {
  private fundAccountRepo: IFundAccountRepo

  constructor(fundAccountRepo: IFundAccountRepo) {
    this.fundAccountRepo = fundAccountRepo
  }

  public async execute(request: GetFundAccountDto): Promise<Response> {
    try {
      const { memberId } = request

      let fundAccount = await this.fundAccountRepo.getById(memberId)

      return right(Result.ok<FundAccount>(fundAccount))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
