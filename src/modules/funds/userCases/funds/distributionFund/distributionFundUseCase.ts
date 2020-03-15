import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { DistributionFundDto } from './distributionFundDto'
import { IFundRepo } from '../../../repos/iFundRepo'
import { FundAmount } from '../../../domain/fundAmount'
import { Fund } from '../../../domain/fund'
import { FundType } from '../../../domain/fundType'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class DistributionFundUseCase implements UseCase<DistributionFundDto, Promise<Response>> {
  private fundRepo: IFundRepo
  private systemPaymentMemberId = '0'

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: DistributionFundDto): Promise<Response> {
    try {
      const { memberId, amount, fundType, relationId, distributionRelationList } = request

      await this.saveFund(amount, memberId, this.systemPaymentMemberId, fundType, relationId)

      for (let item of distributionRelationList) {
        let saveFundResult = await this.saveFund(
          Math.ceil(amount * item.distributionRate),
          item.memberId,
          memberId,
          item.fundType,
          request.relationId
        )

        if (saveFundResult.isLeft()) {
          console.error(saveFundResult.value)
        }
      }

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }

  private async saveFund(
    amount: number,
    incomeMemberId: string,
    paymentMemberId: string,
    type: FundType,
    relationId: string
  ): Promise<Response> {
    const fundAmountOrError = FundAmount.create({
      fundAmount: amount
    })

    if (fundAmountOrError.isFailure) {
      return left(fundAmountOrError)
    }

    let fundOrErrors = Fund.create({
      amount: fundAmountOrError.getValue(),
      status: 'valid',
      incomeMemberId: incomeMemberId,
      paymentMemberId: paymentMemberId,
      createAt: Date.now(),
      descrpiton: '',
      type: type,
      relationId
    })
    if (fundOrErrors.isFailure) {
      return left(fundOrErrors)
    }

    await this.fundRepo.save(fundOrErrors.getValue())
    return right(Result.ok<void>())
  }
}
