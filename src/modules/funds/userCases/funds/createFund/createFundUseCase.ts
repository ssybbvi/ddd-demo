import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { IFundRepo } from '../../../repos/iFundRepo'
import { FundAmount } from '../../../domain/fundAmount'
import { Fund } from '../../../domain/fund'
import { FundType } from '../../../domain/fundType'
import { CreateFundDto } from './createFundDto'
import { FundStatus } from '../../../domain/fundStatus'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateFundUseCase implements UseCase<CreateFundDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: CreateFundDto): Promise<Response> {
    try {
      const { amount,
        incomeUserId,
        paymentUserId,
        status,
        descrption,
        type,
        relationId, } = request

      const newAmount = Math.floor(amount)//去小数点后面的值
      if (newAmount < 1) {
        console.log("小于1的资金变动不记录")
        return right(Result.ok<void>())
      }

      const fundAmountOrError = FundAmount.create({ fundAmount: newAmount })

      if (fundAmountOrError.isFailure) {
        return left(fundAmountOrError)
      }

      let fundOrErrors = Fund.create({
        amount: fundAmountOrError.getValue(),
        status: status as FundStatus,
        incomeUserId: incomeUserId,
        paymentUserId: paymentUserId,
        descrpiton: descrption,
        type: type as FundType,
        relationId
      })

      if (fundOrErrors.isFailure) {
        return left(fundOrErrors)
      }

      await this.fundRepo.save(fundOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
