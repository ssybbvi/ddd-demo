import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { UseCase } from '../../../../../shared/core/UseCase'
import { UpdateFundAccountDto } from './refreshFundAccountDto'
import { IFundAccountRepo } from '../../../repos/iFundAccountRepo'
import { FundAccount } from '../../../domain/fundAccount'
import { IFundRepo } from '../../../repos/iFundRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class RefreshFundAccountUseCase implements UseCase<UpdateFundAccountDto, Promise<Response>> {
  private fundAccountRepo: IFundAccountRepo
  private fundRepo: IFundRepo



  constructor(fundAccountRepo: IFundAccountRepo,fundRepo: IFundRepo) {
    this.fundAccountRepo = fundAccountRepo
    this.fundRepo = fundRepo
  }

  public async execute(request: UpdateFundAccountDto): Promise<Response> {
    try {
      const { recommendedUserId } = request

      const totalAmount=await this.getRecommendedUserTotalAmount(recommendedUserId)

      const fundAccountOrErrors = FundAccount.create(
        {
          totalAmounnt: totalAmount
        },
        new UniqueEntityID(recommendedUserId)
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

  private async getRecommendedUserTotalAmount(recommendedUserId:string){
    let fundList = await this.fundRepo.getListByRecommendedUserId(recommendedUserId)
    let totalAmount = fundList.reduce((acc, item) => {
      if (item.incomeUserId == recommendedUserId) {
        return acc + item.amount.value
      }

      if (
        item.paymentUserId == recommendedUserId &&
        item.type != 'primaryDistribution' &&
        item.type != 'secondaryDistribution'
      ) {
        return acc - item.amount.value
      }
      return acc
    }, 0)

    return  totalAmount
  }
}
