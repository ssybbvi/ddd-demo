import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { IFundAccountRepo } from '../../../repos/iFundAccountRepo'
import { FundAccount } from '../../../domain/fundAccount'
import { UseCase } from '../../../../../shared/core/UseCase'
import { CreateFundAccountDto } from './createFundAccountDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateFundAccountUseCase implements UseCase<CreateFundAccountDto, Promise<Response>> {
  private fundAccountRepo: IFundAccountRepo

  constructor(fundAccountRepo: IFundAccountRepo) {
    this.fundAccountRepo = fundAccountRepo
  }

  public async execute(request: CreateFundAccountDto): Promise<Response> {
    try {
      const { recommendedUserId } = request

      const fundAccountOrErrors= FundAccount.create(
        {
          totalAmounnt: 0
        },
        new UniqueEntityID(recommendedUserId),
        true
      )
      if(fundAccountOrErrors.isFailure){
        return left(fundAccountOrErrors)
      }

      await this.fundAccountRepo.save(fundAccountOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
