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
      const { memberId } = request

      const totalAmount=await this.getMemberTotalAmount(memberId)

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

  private async getMemberTotalAmount(memberId:string){
    let fundList = await this.fundRepo.getListByMemberId(memberId)
    let totalAmount = fundList.reduce((acc, item) => {
      if (item.incomeMemberId == memberId) {
        return acc + item.amount.value
      }

      if (
        item.paymentMemberId == memberId &&
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
