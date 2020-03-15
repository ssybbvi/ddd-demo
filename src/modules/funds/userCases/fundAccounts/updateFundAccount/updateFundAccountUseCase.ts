import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { UseCase } from '../../../../../shared/core/UseCase'
import { UpdateFundAccountDto } from './updateFundAccountDto'
import { IFundAccountRepo } from '../../../repos/iFundAccountRepo'
import { FundAccount } from '../../../domain/fundAccount'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class UpdateFundAccountUseCase implements UseCase<UpdateFundAccountDto, Promise<Response>> {
  private fundAccountRepo: IFundAccountRepo

  constructor(fundAccountRepo: IFundAccountRepo) {
    this.fundAccountRepo = fundAccountRepo
  }

  public async execute(request: UpdateFundAccountDto): Promise<Response> {
    try {
      const { memberId, totalAmount } = request

      const fundAccountOrErrors = FundAccount.create(
        {
          totalAmounnt: totalAmount
        },
        new UniqueEntityID(memberId)
      )

      if (fundAccountOrErrors.isFailure) {
        return left(fundAccountOrErrors)
      }

      await this.fundAccountRepo.save(fundAccountOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
