import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
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